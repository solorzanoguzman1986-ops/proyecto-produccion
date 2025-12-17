#!/bin/bash
# Script para configurar todas las variables de entorno en Vercel

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     ⚙️  CONFIGURACIÓN DE VARIABLES EN VERCEL                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

if [ ! -f ".env.local" ]; then
    echo "❌ .env.local no encontrado"
    exit 1
fi

echo "Este script configurará las variables de entorno en Vercel."
echo "Necesitarás ingresar cada valor manualmente."
echo ""
echo "Variables a configurar:"
echo "  1. DATABASE_URL"
echo "  2. NEXTAUTH_SECRET"
echo "  3. STRIPE_SECRET_KEY"
echo "  4. NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
echo "  5. NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID"
echo "  6. NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID"
echo "  7. STRIPE_WEBHOOK_SECRET"
echo "  8. NEXTAUTH_URL (se actualizará después del deploy)"
echo ""

read -p "¿Continuar? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Configuración cancelada"
    exit 0
fi

# Función para leer y configurar variable
configure_var() {
    local var_name=$1
    local var_value=$(grep "^${var_name}=" .env.local | cut -d '=' -f2- | tr -d '"' | tr -d "'" | xargs)
    
    if [ ! -z "$var_value" ] && [ "$var_value" != "" ]; then
        echo ""
        echo "Configurando ${var_name}..."
        echo "$var_value" | vercel env add "$var_name" production
        echo "✅ ${var_name} configurado"
    else
        echo "⚠️  ${var_name} no encontrado o vacío en .env.local"
    fi
}

# Configurar variables (excepto NEXTAUTH_URL)
echo ""
echo "Configurando variables..."
configure_var "DATABASE_URL"
configure_var "NEXTAUTH_SECRET"
configure_var "STRIPE_SECRET_KEY"
configure_var "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
configure_var "NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID"
configure_var "NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID"
configure_var "STRIPE_WEBHOOK_SECRET"

echo ""
echo "✅ Variables configuradas (excepto NEXTAUTH_URL)"
echo ""
echo "NEXTAUTH_URL se actualizará automáticamente después del primer deploy"
echo "con la URL de producción obtenida."

