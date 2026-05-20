#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4173}"
URL="http://${HOST}:${PORT}"
LOG_DIR="$APP_DIR/data/logs"
PID_FILE="$APP_DIR/data/passage-planner.pid"

mkdir -p "$LOG_DIR"

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" >/dev/null 2>&1; then
  echo "Gate Passage Planner is already running at $URL"
else
  cd "$APP_DIR"
  echo "Starting Gate Passage Planner at $URL"
  HOST="$HOST" PORT="$PORT" nohup npm start >"$LOG_DIR/server.log" 2>&1 &
  echo "$!" > "$PID_FILE"
fi

for _ in {1..30}; do
  if command -v curl >/dev/null 2>&1 && curl -fsS "$URL" >/dev/null 2>&1; then
    break
  fi
  sleep 0.2
done

if command -v firefox >/dev/null 2>&1; then
  firefox "$URL" >/dev/null 2>&1 &
else
  xdg-open "$URL" >/dev/null 2>&1 &
fi
