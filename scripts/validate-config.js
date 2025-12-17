#!/usr/bin/env node

/**
 * Script de validación de configuración
 * Verifica que todas las variables de entorno estén correctamente configuradas
 */

const fs = require('fs')
const path = require('path')

// Colores para consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function validateEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath)) {
    log('❌ Archivo .env.local no encontrado', 'red')
    return false
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const errors = []
  const warnings = []

  // Verificar variables críticas
  const requiredVars = {
    'DATABASE_URL': {
      pattern: /postgresql:\/\/.*@.*\.supabase\.co/,
      message: 'Debe ser una URL de Supabase válida',
    },
    'NEXTAUTH_SECRET': {
      pattern: /.+/,
      message: 'Debe estar configurada',
    },
    'NEXTAUTH_URL': {
      pattern: /https?:\/\/.+/,
      message: 'Debe ser una URL válida',
    },
    'STRIPE_SECRET_KEY': {
      pattern: /sk_(live|test)_[a-zA-Z0-9]+/,
      message: 'Debe empezar con sk_live_ o sk_test_',
    },
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': {
      pattern: /pk_(live|test)_[a-zA-Z0-9]+/,
      message: 'Debe empezar con pk_live_ o pk_test_',
    },
    'NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID': {
      pattern: /price_[a-zA-Z0-9]+/,
      message: 'Debe empezar con price_',
    },
    'NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID': {
      pattern: /price_[a-zA-Z0-9]+/,
      message: 'Debe empezar con price_',
    },
    'STRIPE_WEBHOOK_SECRET': {
      pattern: /whsec_[a-zA-Z0-9]+/,
      message: 'Debe empezar con whsec_',
    },
  }

  // Verificar placeholders
  const placeholders = [
    'TU_PASSWORD_AQUI',
    'TU_PROJECT_REF',
    'TU_PUBLISHABLE_KEY_AQUI',
    'TU_SECRET_KEY_AQUI',
    'TU_BASIC_PRICE_ID_AQUI',
    'TU_PREMIUM_PRICE_ID_AQUI',
    'TU_WEBHOOK_SECRET_AQUI',
  ]

  placeholders.forEach((placeholder) => {
    if (envContent.includes(placeholder)) {
      errors.push(`⚠️  Placeholder no reemplazado: ${placeholder}`)
    }
  })

  // Validar cada variable
  Object.entries(requiredVars).forEach(([varName, config]) => {
    const regex = new RegExp(`${varName}=["']?([^"'\n]+)["']?`, 'i')
    const match = envContent.match(regex)

    if (!match || !match[1]) {
      errors.push(`❌ ${varName} no está configurada`)
      return
    }

    const value = match[1]

    if (!config.pattern.test(value)) {
      errors.push(`❌ ${varName}: ${config.message}`)
    } else {
      // Verificar modo de Stripe
      if (varName === 'STRIPE_SECRET_KEY') {
        if (value.startsWith('sk_test_')) {
          warnings.push(`⚠️  ${varName} está en modo TEST. Para producción usa sk_live_`)
        } else if (value.startsWith('sk_live_')) {
          log(`✅ ${varName} está en modo LIVE (producción)`, 'green')
        }
      }
    }
  })

  // Mostrar resultados
  console.log('\n📋 Resultados de Validación:\n')

  if (errors.length === 0 && warnings.length === 0) {
    log('✅ Todas las validaciones pasaron', 'green')
    return true
  }

  if (errors.length > 0) {
    log('❌ Errores encontrados:', 'red')
    errors.forEach((error) => log(`   ${error}`, 'red'))
  }

  if (warnings.length > 0) {
    log('\n⚠️  Advertencias:', 'yellow')
    warnings.forEach((warning) => log(`   ${warning}`, 'yellow'))
  }

  return errors.length === 0
}

// Ejecutar validación
if (require.main === module) {
  const isValid = validateEnvFile()
  process.exit(isValid ? 0 : 1)
}

module.exports = { validateEnvFile }



