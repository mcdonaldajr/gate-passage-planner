#!/usr/bin/env bash
set -euo pipefail

export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
HOST="${HOST:-0.0.0.0}"
PORT="${PORT:-4173}"
LOCAL_URL="http://127.0.0.1:${PORT}"
LOG_DIR="$APP_DIR/data/logs"
PID_FILE="$APP_DIR/data/passage-planner.pid"
LAUNCH_LOG="$LOG_DIR/launcher.log"
SERVER_RUNNER="$APP_DIR/scripts/run-server-lubuntu.sh"
LAN_IP=""
DESKTOP_MODE=0

if [ "${1:-}" = "--desktop" ]; then
  DESKTOP_MODE=1
fi

timestamp() {
  date "+%Y-%m-%dT%H:%M:%S%z"
}

log() {
  echo "$(timestamp) $*"
}

if [ "$DESKTOP_MODE" -eq 1 ]; then
  mkdir -p "$LOG_DIR"
  exec >>"$LAUNCH_LOG" 2>&1
  trap 'log "ERROR: launcher failed at line ${LINENO} with exit code $?"' ERR
fi

log "start-passage-planner invoked"
log "APP_DIR=$APP_DIR"
log "HOST=$HOST PORT=$PORT"
log "PATH=$PATH"
log "SHELL=${SHELL:-unknown}"
log "PWD=$(pwd)"

for cmd in node curl firefox xdg-open hostname ip setsid systemd-run systemctl; do
  if command -v "$cmd" >/dev/null 2>&1; then
    log "command $cmd: $(command -v "$cmd")"
  else
    log "command $cmd: not found"
  fi
done

if command -v node >/dev/null 2>&1; then
  log "node version: $(node --version 2>&1 || true)"
fi

if command -v hostname >/dev/null 2>&1; then
  LAN_IP="$(hostname -I 2>/dev/null | awk '{print $1}' || true)"
fi

if [ -z "${LAN_IP:-}" ] && command -v ip >/dev/null 2>&1; then
  LAN_IP="$(ip -4 route get 1.1.1.1 2>/dev/null | awk '{for (i=1; i<=NF; i++) if ($i == "src") {print $(i+1); exit}}' || true)"
fi

if [ -z "${LAN_IP:-}" ] && command -v ip >/dev/null 2>&1; then
  LAN_IP="$(ip -4 addr show scope global 2>/dev/null | awk '/inet / {sub(/\/.*/, "", $2); print $2; exit}' || true)"
fi

if [ -z "${LAN_IP:-}" ] && command -v ipconfig >/dev/null 2>&1; then
  LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || true)"
fi

if [ "$HOST" = "0.0.0.0" ] && [ -n "${LAN_IP:-}" ]; then
  DISPLAY_URL="http://${LAN_IP}:${PORT}"
elif [ "$HOST" = "0.0.0.0" ]; then
  DISPLAY_URL=""
else
  DISPLAY_URL="http://${HOST}:${PORT}"
fi

mkdir -p "$LOG_DIR"

server_responds() {
  if command -v node >/dev/null 2>&1; then
    node -e "const http=require('http');const req=http.get('${LOCAL_URL}',res=>{res.resume();process.exit(res.statusCode<500?0:1)});req.on('error',()=>process.exit(1));req.setTimeout(1000,()=>{req.destroy();process.exit(1)});" >/dev/null 2>&1
    return $?
  fi
  command -v curl >/dev/null 2>&1 && curl -fsS --max-time 1 "$LOCAL_URL" >/dev/null 2>&1
}

pid_file_process_running() {
  [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" >/dev/null 2>&1
}

start_server() {
  rm -f "$PID_FILE"
  : > "$LOG_DIR/server.log"
  started=0

  if command -v systemd-run >/dev/null 2>&1; then
    log "Trying detached server with systemd-run --user"
    if command -v systemctl >/dev/null 2>&1; then
      systemctl --user stop gate-passage-planner.service >/dev/null 2>&1 || true
    fi
    if systemd-run --user --unit=gate-passage-planner --collect --setenv=HOST="$HOST" --setenv=PORT="$PORT" "$SERVER_RUNNER" >/dev/null 2>&1; then
      log "systemd-run accepted gate-passage-planner.service"
      started=1
    else
      log "systemd-run failed or user systemd is unavailable; falling back"
    fi
  fi

  if [ "$started" -ne 1 ] && command -v setsid >/dev/null 2>&1; then
    log "Starting detached server with setsid -f and node server.mjs"
    HOST="$HOST" PORT="$PORT" setsid -f "$SERVER_RUNNER" </dev/null &
    started=1
  elif [ "$started" -ne 1 ]; then
    log "Starting detached server with nohup and node server.mjs"
    HOST="$HOST" PORT="$PORT" nohup "$SERVER_RUNNER" </dev/null &
    started=1
  fi

  for pid_attempt in {1..30}; do
    if [ -s "$PID_FILE" ]; then
      log "Server runner wrote PID $(cat "$PID_FILE") on attempt $pid_attempt"
      return 0
    fi
    sleep 0.1
  done

  log "WARNING: server runner did not write a PID file quickly"
  return 0
}

if pid_file_process_running && server_responds; then
  log "Gate Passage Planner is already running at $LOCAL_URL with PID $(cat "$PID_FILE")."
else
  if [ -f "$PID_FILE" ]; then
    if pid_file_process_running; then
      log "PID file exists for PID $(cat "$PID_FILE"), but server did not answer at $LOCAL_URL. Removing stale PID file."
    else
      log "PID file exists, but PID $(cat "$PID_FILE" 2>/dev/null || echo unknown) is not running. Removing stale PID file."
    fi
    rm -f "$PID_FILE"
  fi
  cd "$APP_DIR"
  log "Starting Gate Passage Planner on ${HOST}:${PORT}"
  start_server
  if [ -s "$PID_FILE" ]; then
    log "Started background server PID $(cat "$PID_FILE"); server log is $LOG_DIR/server.log"
  else
    log "Started background server but PID file is missing; server log is $LOG_DIR/server.log"
  fi
fi

ready=0
for attempt in {1..40}; do
  if server_responds; then
    log "Server readiness check passed on attempt $attempt"
    ready=1
    break
  fi
  log "Server readiness check attempt $attempt failed"
  sleep 0.2
done

if [ "$ready" -ne 1 ]; then
  log "WARNING: server did not answer at $LOCAL_URL after readiness checks"
  if [ -f "$LOG_DIR/server.log" ]; then
    log "Last 40 lines of server.log:"
    tail -40 "$LOG_DIR/server.log" || true
  fi
fi

if [ -s "$PID_FILE" ]; then
  if kill -0 "$(cat "$PID_FILE")" >/dev/null 2>&1; then
    log "Post-readiness PID check: PID $(cat "$PID_FILE") is still running"
  else
    log "WARNING: post-readiness PID check failed; PID $(cat "$PID_FILE") is no longer running"
  fi
fi

log "Local URL: $LOCAL_URL"
if [ "$HOST" = "0.0.0.0" ] && [ -n "${DISPLAY_URL:-}" ]; then
  log "LAN URL:   $DISPLAY_URL"
elif [ "$HOST" = "0.0.0.0" ]; then
  log "LAN URL:   unavailable until a network address is assigned"
fi

if [ "$DESKTOP_MODE" -eq 1 ]; then
  exit 0
fi

if command -v open >/dev/null 2>&1; then
  open "$LOCAL_URL" >/dev/null 2>&1 &
elif command -v firefox >/dev/null 2>&1; then
  firefox "$LOCAL_URL" >/dev/null 2>&1 &
else
  xdg-open "$LOCAL_URL" >/dev/null 2>&1 &
fi
