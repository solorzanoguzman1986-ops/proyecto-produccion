import Stripe from 'stripe'

// Validar que la clave secreta esté configurada
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'STRIPE_SECRET_KEY no está configurada. Por favor, configura las variables de entorno.'
  )
}

// Detectar modo (Live o Test) basado en la clave
const isLiveMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_live_')
const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_')

if (!isLiveMode && !isTestMode) {
  console.warn(
    '⚠️  ADVERTENCIA: La clave de Stripe no parece ser válida. Verifica que sea sk_live_... o sk_test_...'
  )
}

if (isLiveMode) {
  console.log('✅ Stripe configurado en modo LIVE (Pagos reales)')
} else if (isTestMode) {
  console.warn('⚠️  Stripe en modo TEST. Para producción, usa claves LIVE (sk_live_...)')
}

// Inicializar Stripe con la clave secreta
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
  typescript: true,
  // Configuraciones adicionales para producción
  maxNetworkRetries: 2,
  timeout: 20000,
})

/**
 * Obtiene el nombre del plan basado en el Price ID de Stripe
 */
export function getPlanFromPriceId(priceId: string): string {
  const basicPriceId = process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID || ''
  const premiumPriceId = process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID || ''

  if (priceId === basicPriceId) return 'basic'
  if (priceId === premiumPriceId) return 'premium'
  return 'free'
}

/**
 * Valida que todas las variables de Stripe estén configuradas
 */
export function validateStripeConfig(): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (!process.env.STRIPE_SECRET_KEY) {
    errors.push('STRIPE_SECRET_KEY no está configurada')
  } else if (!isLiveMode && !isTestMode) {
    errors.push('STRIPE_SECRET_KEY no es válida (debe empezar con sk_live_ o sk_test_)')
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no está configurada')
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID) {
    errors.push('NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID no está configurada')
  }

  if (!process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID) {
    errors.push('NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID no está configurada')
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    errors.push('STRIPE_WEBHOOK_SECRET no está configurada')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Obtiene información del modo actual
 */
export function getStripeMode(): 'live' | 'test' | 'unknown' {
  if (isLiveMode) return 'live'
  if (isTestMode) return 'test'
  return 'unknown'
}
