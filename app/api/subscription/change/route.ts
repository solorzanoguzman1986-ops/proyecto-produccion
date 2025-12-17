import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const changePlanSchema = z.object({
  plan: z.enum(['free', 'basic', 'premium', 'enterprise']),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = changePlanSchema.parse(body)

    // Si el plan es gratuito, cancelar cualquier suscripción de Stripe
    if (plan === 'free') {
      const subscription = await prisma.subscription.findUnique({
        where: { userId: session.user.id },
      })

      if (subscription?.stripeSubscriptionId) {
        // Aquí deberías cancelar la suscripción en Stripe
        // Por ahora solo actualizamos la base de datos
      }

      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: {
          plan: 'free',
          status: 'active',
          cancelAtPeriodEnd: false,
        },
      })

      return NextResponse.json({ message: 'Plan cambiado a Gratis' })
    }

    // Para otros planes, se debe usar Stripe Checkout
    return NextResponse.json(
      { error: 'Use Stripe Checkout para planes de pago' },
      { status: 400 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error('Error al cambiar plan:', error)
    return NextResponse.json(
      { error: 'Error al cambiar plan' },
      { status: 500 }
    )
  }
}

