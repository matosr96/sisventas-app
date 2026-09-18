#!/bin/sh
# Escribe config.json con la URL de la API del entorno. Corre antes de que nginx arranque.
set -eu
printf '{ "apiUrl": "%s" }\n' "${API_URL:-http://localhost:8080/api/v1}" > /usr/share/nginx/html/config.json
