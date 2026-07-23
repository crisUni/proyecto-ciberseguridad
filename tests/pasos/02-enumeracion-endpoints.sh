#!/usr/bin/env bash
#
# Paso 2 - Identificación de Endpoints (T1190)
# Enumeración manual de los endpoints expuestos y sus parámetros
#
# Táctica: Acceso Inicial
# Técnica MITRE: T1190 - Exploit Public-Facing Application
#
# Uso: ./tests/pasos/02-enumeracion-endpoints.sh [BASE_URL]
#   BASE_URL por defecto: http://192.168.56.112:8080

BASE_URL="${1:-http://192.168.56.112:8080}"

echo "==================================================================="
echo " PASO 2: Exploit Public-Facing Application (T1190)"
echo " Identificando endpoints en $BASE_URL"
echo "==================================================================="

echo
echo "--- GET /api/v1/productos?categoria=electronica ---"
curl -v "$BASE_URL/api/v1/productos?categoria=electronica" 2>&1
echo

echo "--- GET /api/v1/proveedor/status?url=https://example.com ---"
curl -v --max-time 5 "$BASE_URL/api/v1/proveedor/status?url=https://example.com" 2>&1 | head -c 500
echo
