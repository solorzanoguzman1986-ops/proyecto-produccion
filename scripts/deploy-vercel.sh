#!/bin/bash
# Script automatizado para deploy a Vercel

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🚀 DEPLOY AUTOMATIZADO A VERCEL                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  Vercel CLI no está instalado${NC}"
    echo "Instalando Vercel CLI..."
    npm i -g vercel
fi

echo -e "${GREEN}✅ Vercel CLI disponible${NC}"
vercel --version

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 1: Verificando configuración"
echo "═══════════════════════════════════════════════════════════════"

# Verificar vercel.json
if [ ! -f "vercel.json" ]; then
    echo -e "${RED}❌ vercel.json no encontrado${NC}"
    exit 1
fi
echo -e "${GREEN}✅ vercel.json encontrado${NC}"

# Verificar build
if [ ! -d ".next" ]; then
    echo -e "${YELLOW}⚠️  Build no encontrado, ejecutando build...${NC}"
    npm run build
fi
echo -e "${GREEN}✅ Build de producción verificado${NC}"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 2: Verificando variables de entorno"
echo "═══════════════════════════════════════════════════════════════"

if [ ! -f ".env.local" ]; then
    echo -e "${RED}❌ .env.local no encontrado${NC}"
    echo "Por favor, crea .env.local con las variables necesarias"
    exit 1
fi

echo -e "${GREEN}✅ .env.local encontrado${NC}"
echo ""
echo "Variables requeridas:"
echo "  - DATABASE_URL"
echo "  - NEXTAUTH_SECRET"
echo "  - STRIPE_SECRET_KEY"
echo "  - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "  - NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID"
echo "  - NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID"
echo "  - STRIPE_WEBHOOK_SECRET"
echo "  - NEXTAUTH_URL (se actualizará después del deploy)"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 3: Configurando variables en Vercel"
echo "═══════════════════════════════════════════════════════════════"

# Leer variables de .env.local y configurarlas en Vercel
if [ -f ".env.local" ]; then
    echo "Configurando variables de entorno en Vercel..."
    
    # Función para configurar variable
    configure_var() {
        local var_name=$1
        local var_value=$(grep "^${var_name}=" .env.local | cut -d '=' -f2- | tr -d '"' | tr -d "'")
        
        if [ ! -z "$var_value" ]; then
            echo "Configurando ${var_name}..."
            echo "$var_value" | vercel env add "$var_name" production
        else
            echo -e "${YELLOW}⚠️  ${var_name} no encontrado en .env.local${NC}"
        fi
    }
    
    # Configurar variables (excepto NEXTAUTH_URL que se actualiza después)
    configure_var "DATABASE_URL"
    configure_var "NEXTAUTH_SECRET"
    configure_var "STRIPE_SECRET_KEY"
    configure_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    configure_var "NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID"
    configure_var "NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID"
    configure_var "STRIPE_WEBHOOK_SECRET"
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 4: Ejecutando deploy"
echo "═══════════════════════════════════════════════════════════════"

echo "Desplegando a producción..."
DEPLOY_OUTPUT=$(vercel --prod --yes 2>&1)
echo "$DEPLOY_OUTPUT" | tee deploy-output.log

# Extraer URL de producción
PROD_URL=$(echo "$DEPLOY_OUTPUT" | grep -oE "https://[a-zA-Z0-9-]+\.vercel\.app" | head -1)

if [ ! -z "$PROD_URL" ]; then
    echo "$PROD_URL" > production_url.txt
    echo -e "${GREEN}✅ Deploy completado${NC}"
    echo -e "${GREEN}URL de producción: ${PROD_URL}${NC}"
else
    echo -e "${RED}❌ No se pudo obtener la URL de producción${NC}"
    echo "Revisa deploy-output.log para más detalles"
    exit 1
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 5: Actualizando NEXTAUTH_URL"
echo "═══════════════════════════════════════════════════════════════"

echo "Actualizando NEXTAUTH_URL con: $PROD_URL"
echo "$PROD_URL" | vercel env add "NEXTAUTH_URL" production

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "PASO 6: Información para configurar Stripe Webhook"
echo "═══════════════════════════════════════════════════════════════"

WEBHOOK_URL="${PROD_URL}/api/stripe/webhook"
echo "URL del webhook: ${WEBHOOK_URL}"
echo ""
echo "Pasos para configurar:"
echo "1. Ve a: https://dashboard.stripe.com/webhooks"
echo "2. Edita tu webhook endpoint"
echo "3. Actualiza la URL a: ${WEBHOOK_URL}"
echo "4. Copia el nuevo webhook secret"
echo "5. Ejecuta: echo 'TU_WEBHOOK_SECRET' | vercel env add STRIPE_WEBHOOK_SECRET production"
echo "6. Redeploy: vercel --prod"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "✅ DEPLOY INICIAL COMPLETADO"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "URL de producción: $PROD_URL"
echo ""
echo "Próximos pasos:"
echo "1. Configura el webhook de Stripe (ver arriba)"
echo "2. Actualiza STRIPE_WEBHOOK_SECRET en Vercel"
echo "3. Ejecuta: ./scripts/redeploy-final.sh"
echo "4. Verifica: ./verificar-deploy.sh"

