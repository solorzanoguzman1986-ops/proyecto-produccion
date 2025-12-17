#!/bin/bash
# Script para verificar el deploy en producción

if [ ! -f "production_url.txt" ]; then
    echo "❌ No se encontró production_url.txt"
    exit 1
fi

PROD_URL=$(cat production_url.txt)
echo "🔍 Verificando deploy en: $PROD_URL"
echo ""

# Verificar que la app carga
echo "1️⃣  Verificando carga de la aplicación..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    echo "   ✅ Aplicación responde (HTTP $HTTP_CODE)"
else
    echo "   ❌ Aplicación no responde (HTTP $HTTP_CODE)"
fi

# Verificar endpoints de API
echo ""
echo "2️⃣  Verificando endpoints de API..."
ENDPOINTS=("/api/auth/register" "/api/subscription")
for endpoint in "${ENDPOINTS[@]}"; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL$endpoint" 2>/dev/null || echo "000")
    if [ "$STATUS" != "000" ]; then
        echo "   ✅ $endpoint (Status: $STATUS)"
    else
        echo "   ⚠️  $endpoint (No accesible)"
    fi
done

echo ""
echo "✅ Verificación completada"
