#!/bin/bash

# Script para configurar el proyecto con SQLite (desarrollo rápido)

echo "🔧 Configurando proyecto con SQLite..."

# Verificar si existe schema.prisma
if [ ! -f "prisma/schema.prisma" ]; then
    echo "❌ No se encontró prisma/schema.prisma"
    exit 1
fi

# Cambiar provider a sqlite
echo "📝 Actualizando schema.prisma para usar SQLite..."
sed -i.bak 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma
sed -i.bak 's|url      = env("DATABASE_URL")|url      = "file:./dev.db"|' prisma/schema.prisma

# Actualizar .env
echo "📝 Actualizando .env..."
if [ -f ".env" ]; then
    sed -i.bak 's|DATABASE_URL="postgresql://.*"|DATABASE_URL="file:./dev.db"|' .env
else
    echo 'DATABASE_URL="file:./dev.db"' >> .env
fi

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones..."
npx prisma migrate dev --name init

# Generar cliente
echo "⚙️  Generando cliente de Prisma..."
npx prisma generate

echo ""
echo "✅ Configuración completada!"
echo ""
echo "Para iniciar el proyecto:"
echo "  npm run dev"
echo ""
echo "Para ver la base de datos:"
echo "  npx prisma studio"




