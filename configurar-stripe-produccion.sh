#!/bin/bash
# Script para configurar Stripe después del deploy

if [ ! -f "production_url.txt" ]; then
    echo "❌ No se encontró production_url.txt"
    echo "   Ejecuta el deploy primero"
    exit 1
fi

PROD_URL=$(cat production_url.txt)
echo "URL de producción: $PROD_URL"
echo ""
echo "📋 Pasos para configurar Stripe:"
echo ""
echo "1. Ve a: https://dashboard.stripe.com/webhooks"
echo "2. Edita tu webhook endpoint"
echo "3. Actualiza la URL a: $PROD_URL/api/stripe/webhook"
echo "4. Copia el nuevo webhook secret"
echo "5. Actualiza STRIPE_WEBHOOK_SECRET en Vercel:"
echo "   vercel env add STRIPE_WEBHOOK_SECRET production"
echo ""
echo "6. Actualiza NEXTAUTH_URL en Vercel:"
echo "   vercel env add NEXTAUTH_URL production"
echo "   (Valor: $PROD_URL)"
