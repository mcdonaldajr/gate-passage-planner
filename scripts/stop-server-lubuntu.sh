#!/usr/bin/env bash
set -euo pipefail

SERVICE_NAME="gate-passage-planner"

systemctl --user stop "${SERVICE_NAME}.service"

echo "Stopped ${SERVICE_NAME}.service"
echo
systemctl --user --no-pager --full status "${SERVICE_NAME}.service" || true
