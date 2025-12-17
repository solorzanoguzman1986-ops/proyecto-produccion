#!/bin/bash
# Script de validación con URL como parámetro

set -e

if [ -z "$1" ]; then
    echo "Uso: $0 <URL_DE_PRODUCCION>"
    echo "Ejemplo: $0 https://tu-proyecto.vercel.app"
    exit 1
fi

PROD_URL=$1
echo "$PROD_URL" > production_url.txt

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     🔍 VALIDACIÓN END-TO-END EN PRODUCCIÓN                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "URL de producción: $PROD_URL"
echo ""

# Ejecutar validación completa
./scripts/validar-produccion-completo.sh

