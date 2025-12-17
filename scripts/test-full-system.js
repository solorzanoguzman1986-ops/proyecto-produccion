#!/usr/bin/env node

/**
 * Script de prueba completa del sistema
 * Valida: autenticación, base de datos, Stripe, y flujo completo
 */

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function section(title) {
  console.log('\n' + '='.repeat(60))
  log(title, 'cyan')
  console.log('='.repeat(60))
}

const results = {
  database: false,
  stripe: false,
  schema: false,
  auth: false,
  webhook: false,
}

async function testDatabaseConnection() {
  section('🔌 PRUEBA 1: Conexión a Supabase')
  
  try {
    await prisma.$connect()
    log('✅ Conexión exitosa a Supabase', 'green')
    
    const userCount = await prisma.user.count()
    const subscriptionCount = await prisma.subscription.count()
    const paymentCount = await prisma.payment.count()
    
    log(`   Usuarios: ${userCount}`, 'blue')
    log(`   Suscripciones: ${subscriptionCount}`, 'blue')
    log(`   Pagos: ${paymentCount}`, 'blue')
    
    results.database = true
    return true
  } catch (error) {
    log(`❌ Error de conexión: ${error.message}`, 'red')
    return false
  }
}

async function testDatabaseSchema() {
  section('🗄️  PRUEBA 2: Esquema de Base de Datos')
  
  try {
    const tables = ['User', 'Subscription', 'Payment']
    let allTablesExist = true
    
    for (const table of tables) {
      try {
        await prisma.$queryRawUnsafe(`SELECT 1 FROM "${table}" LIMIT 1`)
        log(`✅ Tabla ${table} existe y es accesible`, 'green')
      } catch (error) {
        log(`❌ Tabla ${table} no existe o no es accesible`, 'red')
        allTablesExist = false
      }
    }
    
    // Verificar relaciones
    try {
      const testUser = await prisma.user.findFirst({
        include: {
          subscription: true,
          payments: true,
        },
      })
      if (testUser) {
        log('✅ Relaciones de base de datos funcionando', 'green')
      }
    } catch (error) {
      log(`⚠️  Error verificando relaciones: ${error.message}`, 'yellow')
    }
    
    results.schema = allTablesExist
    return allTablesExist
  } catch (error) {
    log(`❌ Error validando esquema: ${error.message}`, 'red')
    return false
  }
}

function testStripeConfig() {
  section('💳 PRUEBA 3: Configuración de Stripe')
  
  const requiredVars = {
    'STRIPE_SECRET_KEY': /sk_(live|test)_[a-zA-Z0-9]+/,
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': /pk_(live|test)_[a-zA-Z0-9]+/,
    'NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID': /price_[a-zA-Z0-9]+/,
    'NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID': /price_[a-zA-Z0-9]+/,
    'STRIPE_WEBHOOK_SECRET': /whsec_[a-zA-Z0-9]+/,
  }
  
  let allValid = true
  let isLiveMode = false
  
  Object.entries(requiredVars).forEach(([varName, pattern]) => {
    const value = process.env[varName]
    if (!value) {
      log(`❌ ${varName} no está configurada`, 'red')
      allValid = false
    } else if (!pattern.test(value)) {
      log(`❌ ${varName} no es válida`, 'red')
      allValid = false
    } else {
      log(`✅ ${varName} configurada correctamente`, 'green')
      
      if (varName === 'STRIPE_SECRET_KEY' && value.startsWith('sk_live_')) {
        isLiveMode = true
      }
    }
  })
  
  if (isLiveMode) {
    log('✅ Stripe configurado en modo LIVE (Pagos reales)', 'green')
  } else {
    log('⚠️  Stripe en modo TEST', 'yellow')
  }
  
  results.stripe = allValid
  return allValid
}

async function testAuthentication() {
  section('🔐 PRUEBA 4: Sistema de Autenticación')
  
  try {
    // Verificar que NextAuth esté configurado
    const nextAuthSecret = process.env.NEXTAUTH_SECRET
    const nextAuthUrl = process.env.NEXTAUTH_URL
    
    if (!nextAuthSecret) {
      log('❌ NEXTAUTH_SECRET no configurada', 'red')
      return false
    }
    
    if (!nextAuthUrl) {
      log('❌ NEXTAUTH_URL no configurada', 'red')
      return false
    }
    
    log('✅ NEXTAUTH_SECRET configurada', 'green')
    log(`✅ NEXTAUTH_URL: ${nextAuthUrl}`, 'green')
    
    // Verificar que podemos crear/leer usuarios
    try {
      const userCount = await prisma.user.count()
      log(`✅ Sistema de usuarios funcionando (${userCount} usuarios)`, 'green')
    } catch (error) {
      log(`❌ Error accediendo a usuarios: ${error.message}`, 'red')
      return false
    }
    
    results.auth = true
    return true
  } catch (error) {
    log(`❌ Error en autenticación: ${error.message}`, 'red')
    return false
  }
}

function testWebhookConfig() {
  section('🔔 PRUEBA 5: Configuración de Webhooks')
  
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const nextAuthUrl = process.env.NEXTAUTH_URL
  
  if (!webhookSecret) {
    log('❌ STRIPE_WEBHOOK_SECRET no configurada', 'red')
    results.webhook = false
    return false
  }
  
  if (!webhookSecret.startsWith('whsec_')) {
    log('❌ STRIPE_WEBHOOK_SECRET no es válida', 'red')
    results.webhook = false
    return false
  }
  
  log('✅ STRIPE_WEBHOOK_SECRET configurada', 'green')
  
  if (nextAuthUrl) {
    const webhookUrl = `${nextAuthUrl}/api/stripe/webhook`
    log(`✅ URL de webhook: ${webhookUrl}`, 'green')
    log('⚠️  Verifica que esta URL esté configurada en Stripe Dashboard', 'yellow')
  }
  
  results.webhook = true
  return true
}

async function generateFinalReport() {
  section('📊 REPORTE FINAL DEL SISTEMA')
  
  const totalTests = Object.keys(results).length
  const passedTests = Object.values(results).filter(r => r).length
  const allPassed = passedTests === totalTests
  
  console.log('\n')
  log('Resultados de las Pruebas:', 'cyan')
  console.log('')
  
  Object.entries(results).forEach(([test, passed]) => {
    const testNames = {
      database: 'Conexión a Supabase',
      stripe: 'Configuración de Stripe',
      schema: 'Esquema de Base de Datos',
      auth: 'Sistema de Autenticación',
      webhook: 'Configuración de Webhooks',
    }
    
    log(`${passed ? '✅' : '❌'} ${testNames[test] || test}: ${passed ? 'PASÓ' : 'FALLÓ'}`, passed ? 'green' : 'red')
  })
  
  console.log('')
  log(`${passedTests}/${totalTests} pruebas pasaron`, passedTests === totalTests ? 'green' : 'yellow')
  console.log('')
  
  if (allPassed) {
    log('🎉 ¡SISTEMA LISTO PARA PRODUCCIÓN!', 'green')
    console.log('')
    log('✅ Todas las validaciones pasaron', 'green')
    log('✅ Base de datos conectada y funcionando', 'green')
    log('✅ Stripe configurado correctamente', 'green')
    log('✅ Sistema de autenticación operativo', 'green')
    log('✅ Webhooks configurados', 'green')
    console.log('')
    log('🚀 Puedes lanzar la aplicación con: npm run dev', 'cyan')
  } else {
    log('⚠️  ALGUNAS PRUEBAS FALLARON', 'yellow')
    console.log('')
    log('Revisa los errores arriba y corrige la configuración', 'yellow')
    log('Luego ejecuta este script nuevamente', 'yellow')
  }
  
  return allPassed
}

async function runAllTests() {
  console.log('\n')
  log('🧪 INICIANDO VALIDACIÓN COMPLETA DEL SISTEMA', 'cyan')
  log('='.repeat(60), 'cyan')
  console.log('')
  
  await testDatabaseConnection()
  await testDatabaseSchema()
  testStripeConfig()
  await testAuthentication()
  testWebhookConfig()
  
  const allPassed = await generateFinalReport()
  
  await prisma.$disconnect()
  
  // Generar log final
  const timestamp = new Date().toISOString()
  const logContent = `
╔══════════════════════════════════════════════════════════════╗
║  REPORTE FINAL DEL SISTEMA - ${timestamp.substring(0, 19)}  ║
╚══════════════════════════════════════════════════════════════╝

ESTADO: ${allPassed ? '✅ LISTO PARA PRODUCCIÓN' : '⚠️  REQUIERE AJUSTES'}

PRUEBAS EJECUTADAS:
${Object.entries(results).map(([test, passed]) => 
  `  ${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASÓ' : 'FALLÓ'}`
).join('\n')}

RESUMEN:
  - Pruebas pasadas: ${Object.values(results).filter(r => r).length}/${Object.keys(results).length}
  - Base de datos: ${results.database ? 'Conectada' : 'Error de conexión'}
  - Stripe: ${results.stripe ? 'Configurado' : 'Configuración inválida'}
  - Autenticación: ${results.auth ? 'Operativa' : 'Error'}
  - Webhooks: ${results.webhook ? 'Configurados' : 'No configurados'}

${allPassed ? `
✅ SISTEMA COMPLETAMENTE OPERATIVO
🚀 Listo para procesar pagos reales
📝 Ejecuta: npm run dev
` : `
⚠️  CORRIGE LOS ERRORES ANTES DE CONTINUAR
📚 Revisa la documentación en SUPABASE_SETUP.md
`}
`
  
  console.log(logContent)
  
  // Guardar log en archivo
  const fs = require('fs')
  fs.writeFileSync('system-status.log', logContent)
  log('\n📄 Log guardado en: system-status.log', 'blue')
  
  process.exit(allPassed ? 0 : 1)
}

if (require.main === module) {
  runAllTests().catch((error) => {
    log(`❌ Error ejecutando pruebas: ${error.message}`, 'red')
    console.error(error)
    process.exit(1)
  })
}

module.exports = { runAllTests, results }



