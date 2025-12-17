#!/bin/bash
# Script para verificar el deploy en producción

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🔍 VERIFICACIÓN DE DEPLOY EN PRODUCCIÓN                 ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ ! -f "production_url.txt" ]; then
    echo "❌ No se encontró production_url.txt"
    echo "   El deploy aún no se ha completado"
    exit 1
fi

PROD_URL=$(cat production_url.txt)
echo "URL de producción: $PROD_URL"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "═══════════════════════════════════════════════════════════════"
echo "1️⃣  Verificando carga del frontend"
echo "═══════════════════════════════════════════════════════════════"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL" 2>/dev/null || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo -e "${GREEN}✅ Frontend carga correctamente (HTTP $HTTP_CODE)${NC}"
else
    echo -e "${RED}❌ Frontend no responde (HTTP $HTTP_CODE)${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "2️⃣  Verificando endpoints de API"
echo "═══════════════════════════════════════════════════════════════"

ENDPOINTS=(
    "/api/auth/register"
    "/api/subscription"
    "/api/stripe/create-checkout"
)

for endpoint in "${ENDPOINTS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL$endpoint" 2>/dev/null || echo "000")
    if [ "$STATUS" != "000" ] && [ "$STATUS" != "404" ]; then
        echo -e "${GREEN}✅ $endpoint (Status: $STATUS)${NC}"
    else
        echo -e "${YELLOW}⚠️  $endpoint (Status: $STATUS)${NC}"
    fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "3️⃣  Verificando webhook de Stripe"
echo "═══════════════════════════════════════════════════════════════"

WEBHOOK_URL="${PROD_URL}/api/stripe/webhook"
WEBHOOK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WEBHOOK_URL" 2>/dev/null || echo "000")

if [ "$WEBHOOK_STATUS" = "400" ] || [ "$WEBHOOK_STATUS" = "401" ]; then
    echo -e "${GREEN}✅ Webhook endpoint accesible (Status: $WEBHOOK_STATUS - esperado sin signature)${NC}"
else
    echo -e "${YELLOW}⚠️  Webhook endpoint (Status: $WEBHOOK_STATUS)${NC}"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "4️⃣  Verificaciones manuales requeridas"
echo "═══════════════════════════════════════════════════════════════"

echo "Las siguientes verificaciones requieren interacción manual:"
echo ""
echo "📋 Checklist:"
echo "  [ ] Registro de usuario funciona"
echo "  [ ] Login funciona"
echo "  [ ] Checkout de Stripe funciona"
echo "  [ ] Webhooks de Stripe se reciben correctamente"
echo "  [ ] Datos se guardan en Supabase"
echo "  [ ] Suscripciones se crean correctamente"
echo ""
echo "Para verificar:"
echo "  1. Abre: $PROD_URL"
echo "  2. Prueba registro/login"
echo "  3. Prueba un pago real"
echo "  4. Verifica en Stripe Dashboard: https://dashboard.stripe.com"
echo "  5. Verifica en Supabase Dashboard: https://supabase.com/dashboard"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ Verificación completada"
echo "═══════════════════════════════════════════════════════════════"

