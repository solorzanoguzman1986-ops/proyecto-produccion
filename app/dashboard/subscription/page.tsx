'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Check, ArrowLeft, Loader2 } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'
import { PLANS, PLAN_NAMES, PLAN_COLORS } from '@/constants/plans'
import type { Plan } from '@/constants/plans'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
)

export default function SubscriptionPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentPlan, setCurrentPlan] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchCurrentPlan()
    }
  }, [status, router])

  const fetchCurrentPlan = async () => {
    try {
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        setCurrentPlan(data.plan)
      }
    } catch (error) {
      console.error('Error al obtener plan actual:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async (planId: string, stripePriceId?: string) => {
    if (planId === 'free') {
      // Cambiar a plan gratuito
      try {
        setProcessing(planId)
        const response = await fetch('/api/subscription/change', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: planId }),
        })

        if (response.ok) {
          router.push('/dashboard?success=plan-changed')
          router.refresh()
        } else {
          alert('Error al cambiar de plan')
        }
      } catch (error) {
        alert('Error al cambiar de plan')
      } finally {
        setProcessing(null)
      }
      return
    }

    if (!stripePriceId) {
      alert('Plan no configurado correctamente')
      return
    }

    try {
      setProcessing(planId)
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: stripePriceId }),
      })

      const { sessionId } = await response.json()

      if (sessionId) {
        const stripe = await stripePromise
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId })
        }
      }
    } catch (error) {
      console.error('Error al crear checkout:', error)
      alert('Error al procesar el pago')
    } finally {
      setProcessing(null)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Volver al Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-primary-600">MonetApp</h1>
            <div></div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Elige tu Plan
          </h2>
          <p className="text-xl text-gray-600">
            Selecciona el plan que mejor se adapte a tus necesidades
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id
            const isProcessing = processing === plan.id

            return (
              <div
                key={plan.id}
                className={`p-8 bg-white rounded-xl shadow-sm border-2 ${
                  plan.popular
                    ? 'border-primary-600 relative'
                    : 'border-gray-200'
                } hover:shadow-lg transition-shadow`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Más Popular
                    </span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.id, plan.stripePriceId)}
                  disabled={isCurrentPlan || isProcessing}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                    isCurrentPlan
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Procesando...
                    </span>
                  ) : isCurrentPlan ? (
                    'Plan Actual'
                  ) : (
                    'Seleccionar Plan'
                  )}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

