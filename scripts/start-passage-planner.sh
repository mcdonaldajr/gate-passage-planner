#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-4173}"
LOCAL_URL="http://127.0.0.1:${PORT}"
LOG_DIR="$APP_DIR/data/logs"
PID_FILE="$APP_DIR/data/passage-planner.pid"
LAN_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"
DESKTOP_MODE=0

if [ "${1:-}" = "--desktop" ]; then
  DESKTOP_MODE=1
fi

if [ -z "${LAN_IP:-}" ]; then
  LAN_IP="$(ip -4 route get 1.1.1.1 2>/dev/null | awk '{for (i=1; i<=NF; i++) if ($i == "src") {print $(i+1); exit}}')"
fi

if [ "$HOST" = "0.0.0.0" ] && [ -n "${LAN_IP:-}" ]; then
  DISPLAY_URL="http://${LAN_IP}:${PORT}"
else
  DISPLAY_URL="http://${HOST}:${PORT}"
fi

mkdir -p "$LOG_DIR"

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" >/dev/null 2>&1; then
  echo "Gate Passage Planner is already running."
else
  cd "$APP_DIR"
  echo "Starting Gate Passage Planner on ${HOST}:${PORT}"
  HOST="$HOST" PORT="$PORT" nohup npm start >"$LOG_DIR/server.log" 2>&1 &
  echo "$!" > "$PID_FILE"
fi

for _ in {1..30}; do
  if command -v curl >/dev/null 2>&1 && curl -fsS "$LOCAL_URL" >/dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

echo "Local URL: $LOCAL_URL"
if [ "$HOST" = "0.0.0.0" ]; then
  echo "LAN URL:   $DISPLAY_URL"
fi

if command -v open >/dev/null 2>&1; then
  open "$LOCAL_URL" >/dev/null 2>&1 &
elif command -v firefox >/dev/null 2>&1; then
  firefox "$LOCAL_URL" >/dev/null 2>&1 &
else
  xdg-open "$LOCAL_URL" >/dev/null 2>&1 &
fi

if [ "$DESKTOP_MODE" -eq 1 ]; then
  exit 0
fi
