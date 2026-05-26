#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DESKTOP_DIR="${HOME}/Desktop"
START_LAUNCHER="${DESKTOP_DIR}/Start Gate Passage Planner Server.desktop"
STOP_LAUNCHER="${DESKTOP_DIR}/Stop Gate Passage Planner Server.desktop"
START_SCRIPT="${APP_DIR}/scripts/start-server-lubuntu.sh"
STOP_SCRIPT="${APP_DIR}/scripts/stop-server-lubuntu.sh"

mkdir -p "$DESKTOP_DIR"
chmod +x "$START_SCRIPT" "$STOP_SCRIPT"
rm -f "${DESKTOP_DIR}/Gate Passage Planner.desktop"

cat > "$START_LAUNCHER" <<DESKTOP
[Desktop Entry]
Type=Application
Name=Start Gate Passage Planner Server
Comment=Start the local passage planner server
Exec=/usr/bin/env bash ${START_SCRIPT}
Terminal=false
Categories=Utility;
DESKTOP

cat > "$STOP_LAUNCHER" <<DESKTOP
[Desktop Entry]
Type=Application
Name=Stop Gate Passage Planner Server
Comment=Stop the local passage planner server
Exec=/usr/bin/env bash ${STOP_SCRIPT}
Terminal=false
Categories=Utility;
DESKTOP

chmod +x "$START_LAUNCHER" "$STOP_LAUNCHER"
echo "Created desktop launcher: $START_LAUNCHER"
echo "Created desktop launcher: $STOP_LAUNCHER"
