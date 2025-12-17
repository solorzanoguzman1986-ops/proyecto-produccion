'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CreditCard,
  Package,
  Calendar,
  LogOut,
  Settings,
  TrendingUp,
  DollarSign,
} from 'lucide-react'
import { PLAN_NAMES, PLAN_COLORS } from '@/constants/plans'

interface Subscription {
  plan: string
  status: string
  currentPeriodEnd: string | null
  cancelAtPeriodEnd: boolean
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    } else if (status === 'authenticated') {
      fetchSubscription()
    }
  }, [status, router])

  const fetchSubscription = async () => {
    try {
      const response = await fetch('/api/subscription')
      if (response.ok) {
        const data = await response.json()
        // Manejar tanto null como objeto de suscripción
        setSubscription(data && data.id ? data : null)
      } else {
        // Si hay error, establecer como null
        setSubscription(null)
      }
    } catch (error) {
      console.error('Error al obtener suscripción:', error)
      setSubscription(null)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">MonetApp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido, {session.user?.name || 'Usuario'}
          </h2>
          <p className="text-gray-600">
            Gestiona tu cuenta y suscripción desde aquí
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Plan Actual</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {subscription
                    ? PLAN_NAMES[subscription.plan] || subscription.plan
                    : 'Gratis'}
                </p>
              </div>
              <Package className="w-8 h-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Estado de Suscripción
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {subscription?.status === 'active'
                    ? 'Activa'
                    : subscription?.status === 'canceled'
                    ? 'Cancelada'
                    : 'Inactiva'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Próximo Pago
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {subscription?.currentPeriodEnd
                    ? new Date(
                        subscription.currentPeriodEnd
                      ).toLocaleDateString('es-ES')
                    : 'N/A'}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscription Card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Tu Suscripción
                </h3>
              </div>
              <div className="p-6">
                {subscription ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          PLAN_COLORS[subscription.plan] || PLAN_COLORS.free
                        }`}
                      >
                        {PLAN_NAMES[subscription.plan] || subscription.plan}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Estado:</span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          subscription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {subscription.status === 'active'
                          ? 'Activa'
                          : subscription.status === 'canceled'
                          ? 'Cancelada'
                          : subscription.status}
                      </span>
                    </div>
                    {subscription.currentPeriodEnd && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          Renovación automática:
                        </span>
                        <span className="text-gray-900 font-medium">
                          {new Date(
                            subscription.currentPeriodEnd
                          ).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                    {subscription.cancelAtPeriodEnd && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-yellow-800 text-sm">
                          Tu suscripción se cancelará al final del período
                          actual.
                        </p>
                      </div>
                    )}
                    <div className="pt-4 border-t border-gray-200">
                      <Link
                        href="/dashboard/subscription"
                        className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Gestionar Suscripción
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      No tienes una suscripción activa
                    </p>
                    <Link
                      href="/dashboard/subscription"
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Ver Planes Disponibles
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Acciones Rápidas
                </h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/dashboard/subscription"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Cambiar Plan</span>
                </Link>
                <Link
                  href="/dashboard/payments"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <DollarSign className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Historial de Pagos</span>
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Settings className="w-5 h-5 text-primary-600" />
                  <span className="text-gray-700">Configuración</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

