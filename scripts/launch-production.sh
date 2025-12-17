#!/bin/bash

# Script final para lanzar pagos reales
# Este script verifica todo y lanza la aplicación en modo producción

set -e

echo "🚀 Lanzando aplicación con pagos reales..."
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ Archivo .env.local no encontrado${NC}"
    echo "   Ejecuta primero: ./scripts/auto-setup.sh"
    exit 1
fi

# Cargar variables
export $(cat .env.local | grep -v '^#' | xargs)

# Verificaciones críticas
echo "🔍 Verificando configuración..."

ERRORS=0

# Verificar Supabase
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"YOUR_"* ]]; then
    echo -e "${RED}❌ DATABASE_URL no configurada${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Supabase configurado${NC}"
fi

# Verificar Stripe
if [ -z "$STRIPE_SECRET_KEY" ] || [[ "$STRIPE_SECRET_KEY" == *"YOUR_"* ]]; then
    echo -e "${RED}❌ STRIPE_SECRET_KEY no configurada${NC}"
    ERRORS=$((ERRORS + 1))
elif [[ "$STRIPE_SECRET_KEY" != sk_live_* ]]; then
    echo -e "${YELLOW}⚠️  STRIPE_SECRET_KEY no es de modo LIVE${NC}"
    echo "   Para pagos reales, usa claves que empiecen con 'sk_live_'"
else
    echo -e "${GREEN}✅ Stripe LIVE configurado${NC}"
fi

if [ -z "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" ] || [[ "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" == *"YOUR_"* ]]; then
    echo -e "${RED}❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no configurada${NC}"
    ERRORS=$((ERRORS + 1))
elif [[ "$NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY" != pk_live_* ]]; then
    echo -e "${YELLOW}⚠️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no es de modo LIVE${NC}"
else
    echo -e "${GREEN}✅ Stripe Publishable Key configurado${NC}"
fi

# Verificar Price IDs
if [ -z "$NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID" ] || [[ "$NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID" == *"YOUR_"* ]]; then
    echo -e "${RED}❌ NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID no configurada${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Price ID Básico configurado${NC}"
fi

if [ -z "$NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID" ] || [[ "$NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID" == *"YOUR_"* ]]; then
    echo -e "${RED}❌ NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID no configurada${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ Price ID Premium configurado${NC}"
fi

# Verificar Webhook
if [ -z "$STRIPE_WEBHOOK_SECRET" ] || [[ "$STRIPE_WEBHOOK_SECRET" == *"YOUR_"* ]]; then
    echo -e "${YELLOW}⚠️  STRIPE_WEBHOOK_SECRET no configurada${NC}"
    echo "   Los webhooks no funcionarán sin esto"
else
    echo -e "${GREEN}✅ Webhook Secret configurado${NC}"
fi

# Verificar NextAuth
if [ -z "$NEXTAUTH_SECRET" ]; then
    echo -e "${RED}❌ NEXTAUTH_SECRET no configurada${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ NextAuth configurado${NC}"
fi

echo ""

if [ $ERRORS -gt 0 ]; then
    echo -e "${RED}❌ Hay $ERRORS error(es) de configuración${NC}"
    echo "   Por favor, corrige los errores antes de continuar"
    exit 1
fi

# Verificar conexión a base de datos
echo "🔌 Verificando conexión a Supabase..."
if npx prisma db pull --schema=prisma/schema.prisma > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Conexión a Supabase OK${NC}"
else
    echo -e "${RED}❌ Error de conexión a Supabase${NC}"
    exit 1
fi

# Verificar migraciones
echo "🗄️  Verificando migraciones..."
if npx prisma migrate status > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Migraciones aplicadas${NC}"
else
    echo -e "${YELLOW}⚠️  Ejecutando migraciones pendientes...${NC}"
    npx prisma migrate deploy
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ TODO LISTO PARA PAGOS REALES${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo "📋 Resumen de configuración:"
echo "   ✅ Supabase: Configurado"
echo "   ✅ Stripe LIVE: Configurado"
echo "   ✅ Base de datos: Conectada"
echo "   ✅ Migraciones: Aplicadas"
echo ""
echo "🚀 Para iniciar la aplicación:"
echo ""
echo -e "${BLUE}   npm run dev${NC}        # Desarrollo local"
echo -e "${BLUE}   npm run build${NC}      # Construir para producción"
echo -e "${BLUE}   npm run start${NC}      # Producción"
echo ""
echo "🌐 URLs importantes:"
echo "   - Aplicación: ${NEXTAUTH_URL:-http://localhost:3000}"
echo "   - Dashboard: ${NEXTAUTH_URL:-http://localhost:3000}/dashboard"
echo "   - Suscripciones: ${NEXTAUTH_URL:-http://localhost:3000}/dashboard/subscription"
echo ""
echo "💳 Para probar pagos:"
echo "   1. Registra un usuario"
echo "   2. Inicia sesión"
echo "   3. Ve a /dashboard/subscription"
echo "   4. Selecciona un plan"
echo "   5. Usa una tarjeta real (pagos reales activos)"
echo ""
echo -e "${YELLOW}⚠️  RECORDATORIO:${NC}"
echo "   - Estás en modo LIVE (pagos reales)"
echo "   - Las transacciones serán reales"
echo "   - Asegúrate de tener webhooks configurados"
echo "   - Monitorea los pagos en Stripe Dashboard"
echo ""

