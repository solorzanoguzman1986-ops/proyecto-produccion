#!/bin/bash
# Script para redeploy final después de configurar webhook

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🔄 REDEPLOY FINAL A PRODUCCIÓN                           ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ ! -f "production_url.txt" ]; then
    echo "❌ No se encontró production_url.txt"
    echo "   Ejecuta primero: ./scripts/deploy-vercel.sh"
    exit 1
fi

PROD_URL=$(cat production_url.txt)
echo "URL de producción: $PROD_URL"
echo ""

echo "Verificando que STRIPE_WEBHOOK_SECRET esté actualizado..."
echo "Si no lo has actualizado, hazlo ahora:"
echo "  vercel env add STRIPE_WEBHOOK_SECRET production"
echo ""
read -p "¿Continuar con redeploy? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Redeploy cancelado"
    exit 0
fi

echo "Ejecutando redeploy..."
vercel --prod --yes

echo ""
echo "✅ Redeploy completado"
echo ""
echo "Verifica el deploy:"
echo "  ./verificar-deploy.sh"
echo ""
echo "O manualmente:"
echo "  - Abre: $PROD_URL"
echo "  - Prueba registro de usuario"
echo "  - Prueba login"
echo "  - Prueba checkout de Stripe"
echo "  - Verifica webhooks en Stripe Dashboard"
echo "  - Verifica datos en Supabase Dashboard"

