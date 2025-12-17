#!/bin/bash

# Script para configurar Supabase y ejecutar migraciones

echo "🚀 Configurando Supabase..."

# Verificar si existe .env
if [ ! -f ".env" ]; then
    echo "❌ No se encontró el archivo .env"
    echo "📝 Por favor, crea el archivo .env con la configuración de Supabase"
    echo "   Puedes usar .env.production.example como referencia"
    exit 1
fi

# Verificar si DATABASE_URL está configurada
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ DATABASE_URL no está configurada en .env"
    exit 1
fi

echo "✅ Archivo .env encontrado"

# Generar cliente de Prisma
echo "⚙️  Generando cliente de Prisma..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Error al generar el cliente de Prisma"
    exit 1
fi

# Verificar conexión a la base de datos
echo "🔌 Verificando conexión a Supabase..."
npx prisma db pull --schema=prisma/schema.prisma > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Conexión exitosa a Supabase"
else
    echo "⚠️  No se pudo verificar la conexión. Continuando con las migraciones..."
fi

# Ejecutar migraciones
echo "🗄️  Ejecutando migraciones..."
read -p "¿Ejecutar migraciones? Esto creará las tablas en Supabase (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[YySs]$ ]]; then
    npx prisma migrate deploy
    
    if [ $? -eq 0 ]; then
        echo "✅ Migraciones ejecutadas correctamente"
    else
        echo "❌ Error al ejecutar migraciones"
        exit 1
    fi
else
    echo "⏭️  Migraciones omitidas"
fi

echo ""
echo "✅ Configuración completada!"
echo ""
echo "Próximos pasos:"
echo "  1. Verifica que las tablas se crearon: npx prisma studio"
echo "  2. Configura Stripe para pagos reales (ver SUPABASE_SETUP.md)"
echo "  3. Actualiza las variables de entorno con las claves de Stripe"
echo "  4. Prueba la aplicación: npm run dev"



