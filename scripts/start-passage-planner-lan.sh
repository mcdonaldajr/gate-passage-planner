#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-4173}"
LAN_IP="$(hostname -I 2>/dev/null | awk '{print $1}')"

if [ -z "${LAN_IP:-}" ]; then
  LAN_IP="$(ip -4 route get 1.1.1.1 2>/dev/null | awk '{for (i=1; i<=NF; i++) if ($i == "src") {print $(i+1); exit}}')"
fi

HOST=0.0.0.0 PORT="$PORT" "$APP_DIR/scripts/start-passage-planner.sh"

echo
echo "LAN access is enabled on this machine."
if [ -n "${LAN_IP:-}" ]; then
  echo "On your iPad, open: http://${LAN_IP}:${PORT}"
else
  echo "On your iPad, open: http://<this-computer-ip>:${PORT}"
fi
echo "Only use this on a trusted private network."
