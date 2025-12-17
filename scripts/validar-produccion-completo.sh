#!/bin/bash
# Script completo de validación end-to-end en producción

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🔍 VALIDACIÓN END-TO-END EN PRODUCCIÓN                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

if [ ! -f "production_url.txt" ]; then
    echo -e "${RED}❌ production_url.txt no encontrado${NC}"
    echo "Por favor, proporciona la URL de producción o ejecuta el deploy primero"
    exit 1
fi

PROD_URL=$(cat production_url.txt)
echo -e "${BLUE}URL de producción: ${PROD_URL}${NC}"
echo ""

# Paso 1: Verificar que la aplicación responde
echo "═══════════════════════════════════════════════════════════════"
echo "1️⃣  VERIFICANDO CARGA DE LA APLICACIÓN"
echo "═══════════════════════════════════════════════════════════════"
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL" 2>/dev/null || echo "000")
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" "$PROD_URL" 2>/dev/null || echo "0")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo -e "${GREEN}✅ Aplicación responde correctamente${NC}"
    echo "   HTTP Status: $HTTP_CODE"
    if [ "$RESPONSE_TIME" != "0" ]; then
        echo "   Tiempo de respuesta: ${RESPONSE_TIME}s"
    fi
else
    echo -e "${RED}❌ Aplicación no responde${NC}"
    echo "   HTTP Status: $HTTP_CODE"
    exit 1
fi

# Verificar contenido HTML
echo ""
echo "Verificando contenido HTML..."
HTML_CONTENT=$(curl -s "$PROD_URL" 2>/dev/null || echo "")
if echo "$HTML_CONTENT" | grep -q "MonetApp\|Next.js\|React"; then
    echo -e "${GREEN}✅ Contenido HTML válido${NC}"
else
    echo -e "${YELLOW}⚠️  Contenido HTML no reconocido${NC}"
fi

# Paso 2: Verificar endpoints de API
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "2️⃣  VERIFICANDO ENDPOINTS DE API"
echo "═══════════════════════════════════════════════════════════════"
echo ""

ENDPOINTS=(
    "/api/auth/register"
    "/api/subscription"
    "/api/stripe/create-checkout"
    "/api/stripe/webhook"
    "/api/payments"
)

for endpoint in "${ENDPOINTS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL$endpoint" 2>/dev/null || echo "000")
    if [ "$STATUS" = "200" ] || [ "$STATUS" = "400" ] || [ "$STATUS" = "401" ] || [ "$STATUS" = "405" ]; then
        echo -e "${GREEN}✅ $endpoint (Status: $STATUS)${NC}"
    else
        echo -e "${YELLOW}⚠️  $endpoint (Status: $STATUS)${NC}"
    fi
done

# Paso 3: Verificar webhook de Stripe
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "3️⃣  VERIFICANDO WEBHOOK DE STRIPE"
echo "═══════════════════════════════════════════════════════════════"
echo ""

WEBHOOK_URL="${PROD_URL}/api/stripe/webhook"
WEBHOOK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$WEBHOOK_URL" 2>/dev/null || echo "000")

if [ "$WEBHOOK_STATUS" = "400" ] || [ "$WEBHOOK_STATUS" = "401" ]; then
    echo -e "${GREEN}✅ Webhook endpoint accesible${NC}"
    echo "   Status: $WEBHOOK_STATUS (esperado sin signature válida)"
else
    echo -e "${YELLOW}⚠️  Webhook endpoint (Status: $WEBHOOK_STATUS)${NC}"
fi

# Paso 4: Instrucciones para validación manual
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "4️⃣  VALIDACIONES MANUALES REQUERIDAS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "Las siguientes validaciones requieren interacción manual:"
echo ""
echo -e "${BLUE}📋 CHECKLIST DE VALIDACIÓN:${NC}"
echo ""
echo "1. REGISTRO DE USUARIO:"
echo "   [ ] Abre: $PROD_URL/register"
echo "   [ ] Crea una cuenta de prueba"
echo "   [ ] Verifica que el registro sea exitoso"
echo "   [ ] Verifica en Supabase Dashboard que el usuario se creó"
echo ""
echo "2. LOGIN:"
echo "   [ ] Abre: $PROD_URL/login"
echo "   [ ] Inicia sesión con la cuenta creada"
echo "   [ ] Verifica que la sesión se mantiene"
echo "   [ ] Verifica redirección al dashboard"
echo ""
echo "3. PAGO REAL CON STRIPE:"
echo "   [ ] Ve al dashboard: $PROD_URL/dashboard"
echo "   [ ] Selecciona un plan (básico o premium)"
echo "   [ ] Inicia el checkout"
echo "   [ ] Completa el pago con tarjeta real (modo LIVE)"
echo "   [ ] Verifica redirección después del pago"
echo "   [ ] Verifica en Stripe Dashboard → Payments que el pago se registró"
echo ""
echo "4. VERIFICACIÓN EN SUPABASE:"
echo "   [ ] Ve a Supabase Dashboard"
echo "   [ ] Verifica tabla 'users' - usuario creado"
echo "   [ ] Verifica tabla 'subscriptions' - suscripción creada"
echo "   [ ] Verifica tabla 'payments' - pago registrado"
echo "   [ ] Verifica que el plan asignado sea correcto"
echo ""
echo "5. WEBHOOKS DE STRIPE:"
echo "   [ ] Ve a Stripe Dashboard → Webhooks"
echo "   [ ] Verifica que los eventos se reciben"
echo "   [ ] Verifica que no hay errores en los logs"
echo "   [ ] Verifica que los eventos se procesan correctamente"
echo ""
echo "6. CONSOLA DEL NAVEGADOR:"
echo "   [ ] Abre DevTools (F12)"
echo "   [ ] Verifica que no hay errores en la consola"
echo "   [ ] Verifica que no hay errores de red"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Validación automática completada${NC}"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Siguiente paso: Ejecuta las validaciones manuales arriba"
echo ""

