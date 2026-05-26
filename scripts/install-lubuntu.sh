#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

echo "Installing Gate Passage Planner dependencies..."

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Installing Node.js and npm with apt..."
  sudo apt update
  sudo apt install -y nodejs npm
fi

if ! command -v firefox >/dev/null 2>&1; then
  echo "Firefox is not installed. Installing Firefox with apt..."
  sudo apt update
  sudo apt install -y firefox
fi

mkdir -p data/cache
chmod +x scripts/start-passage-planner.sh scripts/start-passage-planner-lan.sh scripts/stop-passage-planner.sh scripts/create-desktop-launcher.sh scripts/launch-desktop-lubuntu.sh scripts/run-server-lubuntu.sh

if [ ! -f data/app-settings.json ]; then
  cp data/app-settings.example.json data/app-settings.json
  chmod 600 data/app-settings.json
  echo "Created data/app-settings.json from the example file."
fi

echo "No npm packages are required beyond Node.js itself."
"$APP_DIR/scripts/create-desktop-launcher.sh"
echo "Install complete."
echo
echo "Start the app with:"
echo "  $APP_DIR/scripts/start-passage-planner.sh"
echo
echo "Or use the Gate Passage Planner desktop icon."
