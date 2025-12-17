import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json(
        { error: 'Price ID es requerido' },
        { status: 400 }
      )
    }

    // Obtener o crear customer en Stripe
    let customerId: string
    const userSubscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    })

    if (userSubscription?.stripeCustomerId) {
      customerId = userSubscription.stripeCustomerId
    } else {
      // Crear nuevo customer en Stripe
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      })

      customerId = customer.id

      // Guardar customer ID en la base de datos
      await prisma.subscription.upsert({
        where: { userId: session.user.id },
        update: { stripeCustomerId: customerId },
        create: {
          userId: session.user.id,
          plan: 'free',
          status: 'active',
          stripeCustomerId: customerId,
        },
      })
    }

    // Validar configuración de Stripe
    const { validateStripeConfig } = await import('@/lib/stripe')
    const config = validateStripeConfig()
    if (!config.valid) {
      console.error('Configuración de Stripe inválida:', config.errors)
      return NextResponse.json(
        { error: 'Configuración de pagos no disponible' },
        { status: 500 }
      )
    }

    // Crear sesión de checkout con configuraciones optimizadas para producción
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?success=subscription-created&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard/subscription?canceled=true`,
      metadata: {
        userId: session.user.id,
        userEmail: session.user.email || '',
      },
      // Configuraciones para producción
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: session.user.email || undefined,
      // Configuraciones de suscripción
      subscription_data: {
        metadata: {
          userId: session.user.id,
        },
      },
      // Configuraciones de UI
      consent_collection: {
        terms_of_service: 'required',
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Error al crear checkout:', error)
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 }
    )
  }
}

