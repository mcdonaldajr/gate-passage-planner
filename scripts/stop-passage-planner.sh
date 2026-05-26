#!/usr/bin/env bash
set -euo pipefail

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-4173}"
URL="http://${HOST}:${PORT}/api/shutdown"

if command -v systemctl >/dev/null 2>&1 && systemctl --user list-unit-files gate-passage-planner.service >/dev/null 2>&1; then
  systemctl --user stop gate-passage-planner.service
  echo "Stopped gate-passage-planner.service"
  exit 0
fi

if command -v curl >/dev/null 2>&1; then
  curl -fsS -X POST "$URL" || true
  echo
fi

echo "Stop requested."
