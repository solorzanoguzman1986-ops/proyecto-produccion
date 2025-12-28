export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { stripe, getPlanFromPriceId } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import type Stripe from 'stripe'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

// Validar webhook secret
if (!webhookSecret) {
  console.error('⚠️  STRIPE_WEBHOOK_SECRET no está configurada')
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId

        if (userId && session.subscription) {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              session.subscription as string
            )

            // Actualizar o crear suscripción en la base de datos
            await prisma.subscription.upsert({
              where: { userId },
              update: {
                plan: getPlanFromPriceId(subscription.items.data[0].price.id),
                status: subscription.status === 'active' ? 'active' : 'trialing',
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
              },
              create: {
                userId,
                plan: getPlanFromPriceId(subscription.items.data[0].price.id),
                status: subscription.status === 'active' ? 'active' : 'trialing',
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                cancelAtPeriodEnd: subscription.cancel_at_period_end,
              },
            })

            console.log(`✅ Suscripción creada/actualizada para usuario ${userId}`)
          } catch (error) {
            console.error('Error procesando checkout.session.completed:', error)
            throw error
          }
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (userSubscription) {
          await prisma.subscription.update({
            where: { id: userSubscription.id },
            data: {
              plan: getPlanFromPriceId(subscription.items.data[0].price.id),
              status: subscription.status === 'active' ? 'active' : 'canceled',
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (userSubscription) {
          await prisma.subscription.update({
            where: { id: userSubscription.id },
            data: {
              plan: 'free',
              status: 'canceled',
              stripeSubscriptionId: null,
              currentPeriodEnd: null,
              cancelAtPeriodEnd: false,
            },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (userSubscription && invoice.amount_paid) {
          await prisma.payment.create({
            data: {
              userId: userSubscription.userId,
              amount: invoice.amount_paid / 100, // Convertir de centavos a dólares
              currency: invoice.currency,
              status: 'completed',
              stripePaymentId: invoice.payment_intent as string,
              description: `Pago de suscripción - ${invoice.description || 'N/A'}`,
            },
          })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const userSubscription = await prisma.subscription.findUnique({
          where: { stripeCustomerId: customerId },
        })

        if (userSubscription && invoice.amount_due) {
          await prisma.payment.create({
            data: {
              userId: userSubscription.userId,
              amount: invoice.amount_due / 100,
              currency: invoice.currency,
              status: 'failed',
              stripePaymentId: invoice.payment_intent as string,
              description: `Pago fallido - ${invoice.description || 'N/A'}`,
            },
          })

          // Actualizar estado de suscripción
          await prisma.subscription.update({
            where: { id: userSubscription.id },
            data: {
              status: 'past_due',
            },
          })
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error procesando webhook:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

