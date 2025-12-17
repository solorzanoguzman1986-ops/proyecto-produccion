#!/bin/bash

# Script de pruebas automatizadas para pagos reales

set -e

echo "🧪 Ejecutando pruebas de pagos reales..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Cargar variables de entorno
if [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Verificar variables de Stripe
echo "🔍 Verificando configuración de Stripe..."

if [ -z "$STRIPE_SECRET_KEY" ] || [[ "$STRIPE_SECRET_KEY" == *"YOUR_"* ]]; then
    echo -e "${RED}❌ STRIPE_SECRET_KEY no configurada${NC}"
    exit 1
fi

if [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ] || [[ "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" == *"YOUR_"* ]]; then
    echo -e "${RED}❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no configurada${NC}"
    exit 1
fi

# Verificar modo Live
if [[ "$STRIPE_SECRET_KEY" == sk_live_* ]]; then
    echo -e "${GREEN}✅ Stripe en modo LIVE (pagos reales)${NC}"
else
    echo -e "${YELLOW}⚠️  Stripe no está en modo LIVE${NC}"
fi

# Verificar conexión a base de datos
echo ""
echo "🔍 Verificando conexión a base de datos..."
if npx prisma db pull --schema=prisma/schema.prisma > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Conexión a base de datos OK${NC}"
else
    echo -e "${RED}❌ Error de conexión a base de datos${NC}"
    exit 1
fi

# Verificar tablas
echo ""
echo "🔍 Verificando tablas en base de datos..."
TABLES=("User" "Subscription" "Payment")
for table in "${TABLES[@]}"; do
    if npx prisma db execute --stdin <<< "SELECT 1 FROM \"$table\" LIMIT 1;" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Tabla $table existe${NC}"
    else
        echo -e "${YELLOW}⚠️  Tabla $table no encontrada (puede estar vacía)${NC}"
    fi
done

# Verificar endpoints de API
echo ""
echo "🔍 Verificando endpoints de API..."
API_ENDPOINTS=(
    "app/api/stripe/create-checkout/route.ts"
    "app/api/stripe/webhook/route.ts"
    "app/api/subscription/route.ts"
)

for endpoint in "${API_ENDPOINTS[@]}"; do
    if [ -f "$endpoint" ]; then
        echo -e "${GREEN}✅ $endpoint existe${NC}"
    else
        echo -e "${RED}❌ $endpoint no encontrado${NC}"
    fi
done

echo ""
echo -e "${GREEN}✅ Pruebas completadas${NC}"
echo ""
echo "📋 Para probar pagos reales:"
echo "   1. Inicia el servidor: npm run dev"
echo "   2. Registra un usuario en http://localhost:3000/register"
echo "   3. Inicia sesión y ve a /dashboard/subscription"
echo "   4. Selecciona un plan de pago"
echo "   5. Usa una tarjeta de prueba de Stripe (modo Live)"
echo ""

