#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT="${PORT:-4173}"

HOST=0.0.0.0 PORT="$PORT" "$APP_DIR/scripts/start-passage-planner.sh"
