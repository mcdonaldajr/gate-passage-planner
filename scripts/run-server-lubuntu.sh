#!/usr/bin/env bash
set -euo pipefail

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PID_FILE="$APP_DIR/data/passage-planner.pid"

cd "$APP_DIR"
mkdir -p "$APP_DIR/data/logs"

exec >> "$APP_DIR/data/logs/server.log" 2>&1

echo "$(date "+%Y-%m-%dT%H:%M:%S%z") run-server-lubuntu starting"
echo "HOST=${HOST:-}"
echo "PORT=${PORT:-}"
echo "PID=$$"

echo "$$" > "$PID_FILE"

exec node server.mjs
