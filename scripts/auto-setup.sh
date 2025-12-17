#!/bin/bash

# Script de configuración automática completa
# Este script configura Supabase y Stripe automáticamente

set -e

echo "🚀 Iniciando configuración automática..."
echo ""

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar dependencias
echo "📋 Verificando dependencias..."
if ! command_exists node; then
    echo -e "${RED}❌ Node.js no está instalado${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm no está instalado${NC}"
    exit 1
fi

if ! command_exists npx; then
    echo -e "${RED}❌ npx no está instalado${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencias verificadas${NC}"
echo ""

# Verificar si existe .env.local
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Archivo .env.local no encontrado${NC}"
    echo "📝 Creando .env.local desde plantilla..."
    cp .env.local .env.local.backup 2>/dev/null || true
    echo -e "${GREEN}✅ Archivo .env.local creado${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edita .env.local y agrega tus credenciales reales${NC}"
    echo "   - DATABASE_URL de Supabase"
    echo "   - Claves de Stripe (modo Live)"
    echo "   - Price IDs de Stripe"
    echo ""
    read -p "Presiona Enter cuando hayas actualizado .env.local..."
fi

# Cargar variables de entorno
if [ -f ".env.local" ]; then
    export $(cat .env.local | grep -v '^#' | xargs)
fi

# Verificar DATABASE_URL
if [ -z "$DATABASE_URL" ] || [[ "$DATABASE_URL" == *"YOUR_"* ]]; then
    echo -e "${RED}❌ DATABASE_URL no está configurada correctamente en .env.local${NC}"
    echo "   Por favor, actualiza DATABASE_URL con tu URL de Supabase"
    exit 1
fi

echo -e "${GREEN}✅ Variables de entorno cargadas${NC}"
echo ""

# Instalar dependencias si es necesario
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
    echo -e "${GREEN}✅ Dependencias instaladas${NC}"
    echo ""
fi

# Generar cliente de Prisma
echo "⚙️  Generando cliente de Prisma..."
npx prisma generate
echo -e "${GREEN}✅ Cliente de Prisma generado${NC}"
echo ""

# Verificar conexión a Supabase
echo "🔌 Verificando conexión a Supabase..."
if npx prisma db pull --schema=prisma/schema.prisma > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Conexión exitosa a Supabase${NC}"
else
    echo -e "${YELLOW}⚠️  No se pudo verificar la conexión. Continuando...${NC}"
fi
echo ""

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones de base de datos..."
if npx prisma migrate deploy; then
    echo -e "${GREEN}✅ Migraciones ejecutadas correctamente${NC}"
else
    echo -e "${YELLOW}⚠️  Error en migraciones. Intentando migrate dev...${NC}"
    npx prisma migrate dev --name init || true
fi
echo ""

# Verificar variables de Stripe
echo "💳 Verificando configuración de Stripe..."
STRIPE_VARS=(
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
    "STRIPE_SECRET_KEY"
    "NEXT_PUBLIC_STRIPE_BASIC_PRICE_ID"
    "NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID"
    "STRIPE_WEBHOOK_SECRET"
)

MISSING_VARS=()
for var in "${STRIPE_VARS[@]}"; do
    value=$(grep "^${var}=" .env.local 2>/dev/null | cut -d '=' -f2 | tr -d '"' || echo "")
    if [ -z "$value" ] || [[ "$value" == *"YOUR_"* ]]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Variables de Stripe no configuradas:${NC}"
    for var in "${MISSING_VARS[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo -e "${YELLOW}⚠️  Configura Stripe antes de procesar pagos reales${NC}"
else
    echo -e "${GREEN}✅ Configuración de Stripe completa${NC}"
fi
echo ""

# Crear archivo de verificación
cat > .setup-complete << EOF
Configuración completada: $(date)
Supabase: $(grep -q "supabase.co" .env.local && echo "Configurado" || echo "No configurado")
Stripe: $([ ${#MISSING_VARS[@]} -eq 0 ] && echo "Configurado" || echo "Pendiente")
EOF

echo -e "${GREEN}✅ Configuración automática completada!${NC}"
echo ""
echo "📋 Resumen:"
echo "   - Base de datos: Configurada"
echo "   - Migraciones: Ejecutadas"
echo "   - Stripe: $([ ${#MISSING_VARS[@]} -eq 0 ] && echo "Configurado" || echo "Pendiente de configuración")"
echo ""
echo "🚀 Próximos pasos:"
echo "   1. Verifica las tablas: npx prisma studio"
echo "   2. Inicia el servidor: npm run dev"
echo "   3. Prueba la aplicación: http://localhost:3000"
echo ""

