export interface Plan {
  id: string
  name: string
  price: number
  period: string
  features: string[]
  popular: boolean
  stripePriceId?: string
}

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Gratis',
    price: 0,
    period: 'por siempre',
    features: [
      'Acceso básico',
      'Hasta 10 proyectos',
      'Soporte por email',
      '1GB de almacenamiento',
    ],
    popular: false,
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 9,
    period: 'por mes',
    features: [
      'Todo lo del plan Gratis',
      'Proyectos ilimitados',
      'Soporte prioritario',
      '10GB de almacenamiento',
      'Análisis avanzados',
    ],
    popular: true,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || '',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29,
    period: 'por mes',
    features: [
      'Todo lo del plan Básico',
      'Almacenamiento ilimitado',
      'Soporte 24/7',
      'API avanzada',
      'Integraciones premium',
      'Análisis personalizados',
    ],
    popular: false,
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || '',
  },
]

export const PLAN_NAMES: { [key: string]: string } = {
  free: 'Gratis',
  basic: 'Básico',
  premium: 'Premium',
  enterprise: 'Enterprise',
}

export const PLAN_COLORS: { [key: string]: string } = {
  free: 'bg-gray-100 text-gray-800',
  basic: 'bg-blue-100 text-blue-800',
  premium: 'bg-purple-100 text-purple-800',
  enterprise: 'bg-yellow-100 text-yellow-800',
}




