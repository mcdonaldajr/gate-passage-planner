#!/usr/bin/env bash
set -euo pipefail

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOG_DIR="$APP_DIR/data/logs"
PORT="${PORT:-4173}"
LOCAL_URL="http://127.0.0.1:${PORT}"
BROWSER_LOG="$LOG_DIR/browser.log"

mkdir -p "$LOG_DIR"
exec >>"$LOG_DIR/desktop-launcher.log" 2>&1
trap 'echo "$(date "+%Y-%m-%dT%H:%M:%S%z") ERROR: desktop wrapper failed at line ${LINENO} with exit code $?"' ERR

timestamp() {
  date "+%Y-%m-%dT%H:%M:%S%z"
}

log() {
  echo "$(timestamp) $*"
}

server_responds() {
  if command -v node >/dev/null 2>&1; then
    node -e "const http=require('http');const req=http.get('${LOCAL_URL}',res=>{res.resume();process.exit(res.statusCode<500?0:1)});req.on('error',()=>process.exit(1));req.setTimeout(1000,()=>{req.destroy();process.exit(1)});" >/dev/null 2>&1
    return $?
  fi
  command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "$LOCAL_URL" >/dev/null 2>&1
}

open_browser() {
  if command -v firefox >/dev/null 2>&1; then
    log "Opening Firefox at $LOCAL_URL; browser log is $BROWSER_LOG"
    {
      echo "$(timestamp) firefox launch requested"
      echo "DISPLAY=${DISPLAY:-}"
      echo "WAYLAND_DISPLAY=${WAYLAND_DISPLAY:-}"
      echo "XDG_CURRENT_DESKTOP=${XDG_CURRENT_DESKTOP:-}"
      echo "MOZ_ENABLE_WAYLAND=${MOZ_ENABLE_WAYLAND:-}"
      firefox --new-tab "$LOCAL_URL"
      status=$?
      echo "$(timestamp) firefox exited with status $status"
    } >>"$BROWSER_LOG" 2>&1 &
  elif command -v xdg-open >/dev/null 2>&1; then
    log "Opening xdg-open at $LOCAL_URL; browser log is $BROWSER_LOG"
    {
      echo "$(timestamp) xdg-open launch requested"
      echo "DISPLAY=${DISPLAY:-}"
      echo "WAYLAND_DISPLAY=${WAYLAND_DISPLAY:-}"
      echo "XDG_CURRENT_DESKTOP=${XDG_CURRENT_DESKTOP:-}"
      xdg-open "$LOCAL_URL"
      status=$?
      echo "$(timestamp) xdg-open exited with status $status"
    } >>"$BROWSER_LOG" 2>&1 &
  else
    log "ERROR: neither firefox nor xdg-open is available. Open $LOCAL_URL manually."
    return 0
  fi
}

log "desktop wrapper invoked"
log "APP_DIR=$APP_DIR"
log "PATH=$PATH"
log "LOCAL_URL=$LOCAL_URL"
log "DISPLAY=${DISPLAY:-}"
log "WAYLAND_DISPLAY=${WAYLAND_DISPLAY:-}"
log "XDG_CURRENT_DESKTOP=${XDG_CURRENT_DESKTOP:-}"

if "$APP_DIR/scripts/start-passage-planner.sh" --desktop; then
  log "start-passage-planner.sh returned successfully"
else
  status=$?
  log "ERROR: start-passage-planner.sh failed with exit code $status"
  if [ -f "$LOG_DIR/launcher.log" ]; then
    log "Last 80 lines of launcher.log:"
    tail -80 "$LOG_DIR/launcher.log" || true
  fi
  exit "$status"
fi

ready=0
for attempt in {1..40}; do
  if server_responds; then
    log "Wrapper readiness check passed on attempt $attempt"
    ready=1
    break
  fi
  log "Wrapper readiness check attempt $attempt failed"
  sleep 0.25
done

if [ "$ready" -ne 1 ]; then
  log "WARNING: opening browser even though server did not answer yet"
fi

open_browser
