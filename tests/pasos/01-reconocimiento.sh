#!/usr/bin/env bash
#
# Paso 1 - Active Scanning (T1595)
# Reconocimiento inicial de la red Host-Only
#
# Táctica: Reconocimiento
# Técnica MITRE: T1595 - Active Scanning
#
# Uso: ./tests/pasos/01-reconocimiento.sh [TARGET_IP]
#   TARGET_IP por defecto: 192.168.56.112

TARGET="${1:-192.168.56.112}"

echo "==================================================================="
echo " PASO 1: Active Scanning (T1595)"
echo " Escaneando puertos en $TARGET"
echo "==================================================================="

nmap -sV "$TARGET" -p 8080,9090
