#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"
NODE_BIN="$(command -v node || true)"
UNIT_DIR="${HOME}/.config/systemd/user"
UNIT_FILE="${UNIT_DIR}/gate-passage-planner.service"

echo "Installing Gate Passage Planner dependencies..."

if [ -z "$NODE_BIN" ]; then
  echo "Node.js is not installed. Installing Node.js and npm with apt..."
  sudo apt update
  sudo apt install -y nodejs npm
  NODE_BIN="$(command -v node)"
fi

mkdir -p data/cache
chmod +x scripts/start-passage-planner.sh scripts/start-passage-planner-lan.sh scripts/stop-passage-planner.sh scripts/create-desktop-launcher.sh scripts/launch-desktop-lubuntu.sh scripts/run-server-lubuntu.sh scripts/start-server-lubuntu.sh scripts/stop-server-lubuntu.sh

if [ ! -f data/app-settings.json ]; then
  cp data/app-settings.example.json data/app-settings.json
  chmod 600 data/app-settings.json
  echo "Created data/app-settings.json from the example file."
fi

mkdir -p "$UNIT_DIR"
cat > "$UNIT_FILE" <<EOF
[Unit]
Description=Gate Passage Planner local web server
After=network.target

[Service]
Type=simple
WorkingDirectory=${APP_DIR}
Environment=HOST=0.0.0.0
Environment=PORT=4173
Environment=PATH=/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin
ExecStart=${NODE_BIN} ${APP_DIR}/server.mjs
Restart=on-failure
RestartSec=2

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload

echo "No npm packages are required beyond Node.js itself."
"$APP_DIR/scripts/create-desktop-launcher.sh"
echo "Install complete."
echo
echo "Start the server with:"
echo "  systemctl --user start gate-passage-planner"
echo "Stop the server with:"
echo "  systemctl --user stop gate-passage-planner"
echo "Check logs with:"
echo "  journalctl --user -u gate-passage-planner -f"
echo
echo "Or use the Gate Passage Planner Start/Stop desktop icons."
