#!/usr/bin/env bash
# Atualiza o site na VPS. Uso: ./deploy.sh
# Ajuste BACKEND_SERVICE para o nome do serviço do backend (systemd) ou deixe vazio para pular.
set -euo pipefail

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_SERVICE="${BACKEND_SERVICE:-}"

cd "$APP_DIR"
git pull --ff-only origin main

cd "$APP_DIR/frontend"
npm ci
npm run build

if [ -n "$BACKEND_SERVICE" ]; then
  cd "$APP_DIR/backend"
  [ -d .venv ] && .venv/bin/pip install -q -r requirements_mysql.txt
  sudo systemctl restart "$BACKEND_SERVICE"
fi

sudo systemctl reload nginx
echo "Deploy concluído."
