#!/bin/bash

# Script de configuración completa para producción
# Supabase + Stripe LIVE

set -e  # Salir si hay errores

echo "🚀 Configuración Automática para Producción"
echo "=========================================="
echo ""

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar que .env.local existe
if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ No se encontró .env.local${NC}"
    echo "📝 Creando .env.local desde template..."
    cp .env.production.example .env.local 2>/dev/null || echo "⚠️  Crea .env.local manualmente"
    echo -e "${YELLOW}⚠️  Por favor, edita .env.local con tus valores reales${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Archivo .env.local encontrado${NC}"

# Verificar variables críticas
echo ""
echo "🔍 Verificando variables de entorno..."

MISSING_VARS=0

if ! grep -q "DATABASE_URL=" .env.local || grep -q "TU_PASSWORD_AQUI" .env.local; then
    echo -e "${RED}❌ DATABASE_URL no configurada correctamente${NC}"
    MISSING_VARS=1
else
    echo -e "${GREEN}✅ DATABASE_URL configurada${NC}"
fi

if ! grep -q "STRIPE_SECRET_KEY=" .env.local || grep -q "TU_SECRET_KEY_AQUI" .env.local; then
    echo -e "${RED}❌ STRIPE_SECRET_KEY no configurada${NC}"
    MISSING_VARS=1
else
    echo -e "${GREEN}✅ STRIPE_SECRET_KEY configurada${NC}"
fi

if ! grep -q "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=" .env.local || grep -q "TU_PUBLISHABLE_KEY_AQUI" .env.local; then
    echo -e "${RED}❌ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no configurada${NC}"
    MISSING_VARS=1
else
    echo -e "${GREEN}✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY configurada${NC}"
fi

if [ $MISSING_VARS -eq 1 ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Por favor, completa todas las variables en .env.local${NC}"
    echo "   Revisa SUPABASE_SETUP.md para instrucciones detalladas"
    exit 1
fi

# Cargar variables de entorno
export $(cat .env.local | grep -v '^#' | xargs)

# Verificar modo de Stripe
if echo "$STRIPE_SECRET_KEY" | grep -q "sk_live_"; then
    echo -e "${GREEN}✅ Stripe configurado en modo LIVE${NC}"
elif echo "$STRIPE_SECRET_KEY" | grep -q "sk_test_"; then
    echo -e "${YELLOW}⚠️  Stripe en modo TEST. Para producción usa sk_live_${NC}"
else
    echo -e "${RED}❌ STRIPE_SECRET_KEY no válida${NC}"
    exit 1
fi

echo ""
echo "⚙️  Generando cliente de Prisma..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al generar cliente de Prisma${NC}"
    exit 1
fi

echo ""
echo "🔌 Verificando conexión a Supabase..."
npx prisma db pull > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Conexión exitosa a Supabase${NC}"
else
    echo -e "${YELLOW}⚠️  No se pudo verificar la conexión. Continuando...${NC}"
fi

echo ""
echo "🗄️  Ejecutando migraciones..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migraciones ejecutadas correctamente${NC}"
else
    echo -e "${RED}❌ Error al ejecutar migraciones${NC}"
    exit 1
fi

echo ""
echo "🧪 Ejecutando validaciones..."
node scripts/validate-config.js 2>/dev/null || echo "⚠️  Script de validación no disponible"

echo ""
echo -e "${GREEN}=========================================="
echo "✅ Configuración completada!"
echo "==========================================${NC}"
echo ""
echo "Próximos pasos:"
echo "  1. Verifica las tablas: npx prisma studio"
echo "  2. Prueba la aplicación: npm run dev"
echo "  3. Verifica webhooks en Stripe Dashboard"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "   - Asegúrate de que los webhooks estén configurados en Stripe"
echo "   - Verifica que NEXTAUTH_URL sea correcto para producción"
echo "   - Revisa que todas las claves sean de modo LIVE"
echo ""



