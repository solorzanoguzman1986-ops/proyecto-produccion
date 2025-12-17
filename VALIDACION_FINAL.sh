#!/bin/bash

# Script de validación final del sistema
# Ejecuta todas las validaciones y pruebas

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║        VALIDACIÓN FINAL DEL SISTEMA                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado o no está en el PATH"
    echo "   Por favor, instala Node.js o configura el PATH"
    exit 1
fi

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json"
    echo "   Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

# Verificar .env.local
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local no encontrado"
    echo "   Por favor, crea el archivo .env.local con tus credenciales"
    exit 1
fi

echo "✅ Archivos base encontrados"
echo ""

# Cargar variables de entorno
export $(cat .env.local | grep -v '^#' | xargs)

echo "🔍 PASO 1: Validando configuración..."
echo "======================================"
node scripts/validate-config.js
VALIDATION_EXIT=$?

if [ $VALIDATION_EXIT -ne 0 ]; then
    echo ""
    echo "❌ Validación falló. Revisa la configuración en .env.local"
    exit 1
fi

echo ""
echo "🔧 PASO 2: Reconstruyendo backend..."
echo "====================================="
npx prisma generate
echo "✅ Prisma Client generado"

echo ""
echo "🔌 PASO 3: Verificando conexión a Supabase..."
echo "=============================================="
npx prisma db pull --schema=prisma/schema.prisma > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Conexión exitosa a Supabase"
else
    echo "⚠️  No se pudo verificar la conexión. Continuando..."
fi

echo ""
echo "🗄️  PASO 4: Verificando migraciones..."
echo "======================================"
npx prisma migrate status
echo ""

echo "🧪 PASO 5: Ejecutando pruebas del sistema..."
echo "============================================"
node scripts/test-payments.js
TEST_EXIT=$?

echo ""
echo "💳 PASO 6: Simulando flujo de pago..."
echo "======================================"
node scripts/simulate-payment.js
SIMULATION_EXIT=$?

echo ""
echo "🧪 PASO 7: Ejecutando validación completa..."
echo "============================================"
node scripts/test-full-system.js
FULL_TEST_EXIT=$?

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                    RESUMEN FINAL                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ $VALIDATION_EXIT -eq 0 ] && [ $TEST_EXIT -eq 0 ] && [ $FULL_TEST_EXIT -eq 0 ]; then
    echo "✅ TODAS LAS VALIDACIONES PASARON"
    echo ""
    echo "🎉 SISTEMA LISTO PARA PRODUCCIÓN"
    echo ""
    echo "📋 Próximos pasos:"
    echo "   1. Ejecuta: npm run dev"
    echo "   2. Abre: http://localhost:3000"
    echo "   3. Prueba el flujo completo de pago"
    echo ""
    echo "📊 Monitoreo:"
    echo "   - Stripe Dashboard: https://dashboard.stripe.com"
    echo "   - Supabase Dashboard: https://supabase.com/dashboard"
    echo ""
    exit 0
else
    echo "⚠️  ALGUNAS VALIDACIONES FALLARON"
    echo ""
    echo "Revisa los errores arriba y corrige la configuración"
    echo ""
    exit 1
fi



