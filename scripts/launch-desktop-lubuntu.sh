#!/usr/bin/env bash
set -euo pipefail

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$APP_DIR/data/logs"
PORT="${PORT:-4173}"
LOCAL_URL="http://127.0.0.1:${PORT}"

mkdir -p "$LOG_DIR"
exec >>"$LOG_DIR/desktop-launcher.log" 2>&1

echo "$(date): launching Gate Passage Planner desktop icon"

"$APP_DIR/scripts/start-passage-planner.sh" --desktop

for _ in {1..40}; do
  if command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "$LOCAL_URL" >/dev/null 2>&1; then
    break
  fi
  sleep 0.25
done

if command -v firefox >/dev/null 2>&1; then
  firefox "$LOCAL_URL" >/dev/null 2>&1 &
else
  xdg-open "$LOCAL_URL" >/dev/null 2>&1 &
fi
