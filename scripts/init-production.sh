#!/bin/bash

# Script de inicialización completa para producción
# Este script configura todo automáticamente

set -e

echo "🚀 Inicialización Automática para Producción"
echo "=============================================="
echo ""

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ No se encontró package.json. Ejecuta este script desde la raíz del proyecto"
    exit 1
fi

echo "📦 Instalando dependencias..."
npm install

echo ""
echo "🔧 Configurando variables de entorno..."

# Crear .env.local si no existe
if [ ! -f ".env.local" ]; then
    echo "📝 Creando .env.local desde template..."
    if [ -f ".env.production.example" ]; then
        cp .env.production.example .env.local
        echo "✅ .env.local creado. Por favor, completa los valores."
    else
        echo "⚠️  .env.production.example no encontrado. Crea .env.local manualmente."
    fi
fi

echo ""
echo "⚙️  Generando cliente de Prisma..."
npx prisma generate

echo ""
echo "✅ Inicialización completada!"
echo ""
echo "Próximos pasos:"
echo "  1. Edita .env.local con tus valores reales de Supabase y Stripe"
echo "  2. Ejecuta: npm run setup:production"
echo "  3. Ejecuta: npm run dev"
echo ""



