#!/usr/bin/env node

/**
 * Script para simular un pago y verificar que el webhook registre el estado
 * NOTA: Este script simula la lógica, pero requiere un webhook real de Stripe
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

async function simulatePaymentFlow() {
  console.log('\n')
  log('💳 SIMULACIÓN DE FLUJO DE PAGO', 'cyan')
  console.log('='.repeat(60))
  console.log('')
  
  try {
    // 1. Verificar que hay usuarios en la base de datos
    log('1️⃣  Verificando usuarios en la base de datos...', 'blue')
    const users = await prisma.user.findMany({
      take: 1,
      include: {
        subscription: true,
        payments: true,
      },
    })
    
    if (users.length === 0) {
      log('⚠️  No hay usuarios en la base de datos', 'yellow')
      log('   Crea un usuario primero desde la aplicación web', 'yellow')
      return false
    }
    
    const testUser = users[0]
    log(`✅ Usuario encontrado: ${testUser.email}`, 'green')
    log(`   ID: ${testUser.id}`, 'blue')
    log(`   Suscripción actual: ${testUser.subscription?.plan || 'Ninguna'}`, 'blue')
    log(`   Pagos registrados: ${testUser.payments.length}`, 'blue')
    
    // 2. Verificar estructura de suscripción
    console.log('')
    log('2️⃣  Verificando estructura de suscripción...', 'blue')
    
    if (testUser.subscription) {
      log('✅ Suscripción existente:', 'green')
      log(`   Plan: ${testUser.subscription.plan}`, 'blue')
      log(`   Estado: ${testUser.subscription.status}`, 'blue')
      log(`   Stripe Customer ID: ${testUser.subscription.stripeCustomerId || 'No asignado'}`, 'blue')
      log(`   Stripe Subscription ID: ${testUser.subscription.stripeSubscriptionId || 'No asignado'}`, 'blue')
    } else {
      log('⚠️  Usuario sin suscripción', 'yellow')
      log('   Se creará una suscripción cuando se procese el primer pago', 'yellow')
    }
    
    // 3. Verificar estructura de pagos
    console.log('')
    log('3️⃣  Verificando historial de pagos...', 'blue')
    
    if (testUser.payments.length > 0) {
      log(`✅ ${testUser.payments.length} pago(s) registrado(s):`, 'green')
      testUser.payments.forEach((payment, index) => {
        console.log(`   ${index + 1}. ${payment.amount} ${payment.currency.toUpperCase()} - ${payment.status} - ${new Date(payment.createdAt).toLocaleDateString()}`)
      })
    } else {
      log('⚠️  No hay pagos registrados aún', 'yellow')
      log('   Los pagos se registrarán cuando se procesen desde Stripe', 'yellow')
    }
    
    // 4. Verificar configuración de webhook
    console.log('')
    log('4️⃣  Verificando configuración de webhook...', 'blue')
    
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    const nextAuthUrl = process.env.NEXTAUTH_URL
    
    if (webhookSecret && webhookSecret.startsWith('whsec_')) {
      log('✅ STRIPE_WEBHOOK_SECRET configurada', 'green')
    } else {
      log('❌ STRIPE_WEBHOOK_SECRET no configurada correctamente', 'yellow')
    }
    
    if (nextAuthUrl) {
      const webhookUrl = `${nextAuthUrl}/api/stripe/webhook`
      log(`✅ URL de webhook: ${webhookUrl}`, 'green')
      log('⚠️  IMPORTANTE: Esta URL debe estar configurada en Stripe Dashboard', 'yellow')
      log('   Stripe Dashboard → Developers → Webhooks', 'yellow')
    }
    
    // 5. Simular flujo de webhook (información)
    console.log('')
    log('5️⃣  Flujo de Webhook (Información):', 'blue')
    log('   Cuando Stripe procesa un pago:', 'blue')
    log('   1. Envía evento a: /api/stripe/webhook', 'blue')
    log('   2. El webhook valida la firma', 'blue')
    log('   3. Actualiza la suscripción en la base de datos', 'blue')
    log('   4. Registra el pago en la tabla Payment', 'blue')
    log('   5. Actualiza el estado del usuario', 'blue')
    
    // 6. Verificar que las tablas están listas
    console.log('')
    log('6️⃣  Verificando que las tablas están listas...', 'blue')
    
    const tableChecks = {
      'User': await prisma.user.count(),
      'Subscription': await prisma.subscription.count(),
      'Payment': await prisma.payment.count(),
    }
    
    Object.entries(tableChecks).forEach(([table, count]) => {
      log(`   ✅ Tabla ${table}: ${count} registro(s)`, 'green')
    })
    
    console.log('')
    log('✅ SIMULACIÓN COMPLETA', 'green')
    log('', 'reset')
    log('📝 NOTA: Para probar un pago real:', 'yellow')
    log('   1. Inicia la aplicación: npm run dev', 'yellow')
    log('   2. Registra un usuario o inicia sesión', 'yellow')
    log('   3. Ve a Dashboard → Suscripción', 'yellow')
    log('   4. Selecciona un plan de pago', 'yellow')
    log('   5. Completa el checkout de Stripe', 'yellow')
    log('   6. Verifica que el webhook actualice la base de datos', 'yellow')
    log('   7. Revisa el dashboard para ver la suscripción activa', 'yellow')
    
    return true
  } catch (error) {
    log(`❌ Error en simulación: ${error.message}`, 'yellow')
    console.error(error)
    return false
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  simulatePaymentFlow().then((success) => {
    process.exit(success ? 0 : 1)
  }).catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
}

module.exports = { simulatePaymentFlow }



