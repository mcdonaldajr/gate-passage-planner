#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="gate-passage-planner"
PORT="${PORT:-4173}"

systemctl --user daemon-reload
systemctl --user start "${SERVICE_NAME}.service"

echo "Started ${SERVICE_NAME}.service"
echo "Local URL: http://127.0.0.1:${PORT}"
echo
systemctl --user --no-pager --full status "${SERVICE_NAME}.service" || true
