#!/usr/bin/env node

/**
 * Script de prueba para validar el flujo de pagos
 * Ejecuta pruebas automatizadas del sistema de pagos
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function testDatabaseConnection() {
  console.log('🔌 Probando conexión a base de datos...')
  try {
    await prisma.$connect()
    const userCount = await prisma.user.count()
    console.log(`✅ Conexión exitosa. Usuarios en BD: ${userCount}`)
    return true
  } catch (error) {
    console.error('❌ Error de conexión:', error.message)
    return false
  }
}

async function testStripeConfig() {
  console.log('\n💳 Validando configuración de Stripe...')
  
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID',
    'NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID',
    'STRIPE_WEBHOOK_SECRET',
  ]

  const missing = []
  const invalid = []

  requiredVars.forEach((varName) => {
    const value = process.env[varName]
    if (!value) {
      missing.push(varName)
    } else if (varName.includes('SECRET_KEY') && !value.startsWith('sk_')) {
      invalid.push(`${varName} no es válida`)
    } else if (varName.includes('PUBLISHABLE_KEY') && !value.startsWith('pk_')) {
      invalid.push(`${varName} no es válida`)
    } else if (varName.includes('PRICE_ID') && !value.startsWith('price_')) {
      invalid.push(`${varName} no es válida`)
    } else if (varName.includes('WEBHOOK_SECRET') && !value.startsWith('whsec_')) {
      invalid.push(`${varName} no es válida`)
    }
  })

  if (missing.length > 0) {
    console.error('❌ Variables faltantes:', missing.join(', '))
    return false
  }

  if (invalid.length > 0) {
    console.error('❌ Variables inválidas:', invalid.join(', '))
    return false
  }

  // Verificar modo
  const isLive = process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_')
  const isTest = process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_')

  if (isLive) {
    console.log('✅ Stripe configurado en modo LIVE (producción)')
  } else if (isTest) {
    console.log('⚠️  Stripe en modo TEST')
  } else {
    console.error('❌ STRIPE_SECRET_KEY no válida')
    return false
  }

  return true
}

async function testDatabaseSchema() {
  console.log('\n🗄️  Validando esquema de base de datos...')
  
  try {
    // Verificar que las tablas existan
    const tables = ['User', 'Subscription', 'Payment']
    
    for (const table of tables) {
      try {
        await prisma.$queryRawUnsafe(`SELECT 1 FROM "${table}" LIMIT 1`)
        console.log(`✅ Tabla ${table} existe`)
      } catch (error) {
        console.error(`❌ Tabla ${table} no existe o no es accesible`)
        return false
      }
    }

    return true
  } catch (error) {
    console.error('❌ Error validando esquema:', error.message)
    return false
  }
}

async function runTests() {
  console.log('🧪 Ejecutando pruebas del sistema de pagos\n')
  console.log('=' .repeat(50))

  const results = {
    database: await testDatabaseConnection(),
    stripe: await testStripeConfig(),
    schema: await testDatabaseSchema(),
  }

  console.log('\n' + '='.repeat(50))
  console.log('\n📊 Resumen de Pruebas:\n')

  Object.entries(results).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASÓ' : 'FALLÓ'}`)
  })

  const allPassed = Object.values(results).every((r) => r)

  if (allPassed) {
    console.log('\n✅ Todas las pruebas pasaron')
    console.log('🚀 El sistema está listo para procesar pagos reales')
  } else {
    console.log('\n❌ Algunas pruebas fallaron')
    console.log('⚠️  Revisa la configuración antes de procesar pagos reales')
  }

  await prisma.$disconnect()
  process.exit(allPassed ? 0 : 1)
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runTests().catch((error) => {
    console.error('❌ Error ejecutando pruebas:', error)
    process.exit(1)
  })
}

module.exports = { testDatabaseConnection, testStripeConfig, testDatabaseSchema }



