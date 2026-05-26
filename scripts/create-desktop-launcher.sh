#!/usr/bin/env bash
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DESKTOP_DIR="${HOME}/Desktop"
LAUNCHER="${DESKTOP_DIR}/Gate Passage Planner.desktop"
DESKTOP_WRAPPER="${APP_DIR}/scripts/launch-desktop-lubuntu.sh"

mkdir -p "$DESKTOP_DIR"
chmod +x "$APP_DIR/scripts/start-passage-planner.sh" "$DESKTOP_WRAPPER"

cat > "$LAUNCHER" <<DESKTOP
[Desktop Entry]
Type=Application
Name=Gate Passage Planner
Comment=Start the local passage planner and open Firefox
Exec=/usr/bin/env bash ${DESKTOP_WRAPPER}
Terminal=false
Categories=Utility;
DESKTOP

chmod +x "$LAUNCHER"
echo "Created desktop launcher: $LAUNCHER"
