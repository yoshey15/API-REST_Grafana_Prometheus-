#!/bin/bash
# Script para generar tráfico sintético a la API

BASE_URL="http://localhost:3000"
ENDPOINTS=("/" "/api/datos" "/api/lento")

echo "Generando tráfico... (Ctrl+C para detener)"

while true; do
  ENDPOINT=${ENDPOINTS[$RANDOM % ${#ENDPOINTS[@]}]}
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$ENDPOINT")
  echo "GET $ENDPOINT → HTTP $STATUS"
  sleep 1
done
