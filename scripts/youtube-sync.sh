#!/usr/bin/env bash
# Daily YouTube shorts sync — calls the production /api/cron/youtube-sync.
# Runs under launchd (see scripts/com.troublebaba.youtube-sync.plist).
#
# Reads CRON_SECRET from ~/.troublebaba.env so the secret never lives in the
# repo. The file format is one KEY=VALUE per line, e.g.:
#   CRON_SECRET=tbb_yt_abc123...
#
# Logs to ~/Library/Logs/troublebaba/youtube-sync.log (rotated by launchd).

set -u

ENDPOINT="https://troublebaba.com/api/cron/youtube-sync"
ENV_FILE="${HOME}/.troublebaba.env"
LOG_DIR="${HOME}/Library/Logs/troublebaba"
LOG_FILE="${LOG_DIR}/youtube-sync.log"

mkdir -p "$LOG_DIR"

ts() { date "+%Y-%m-%d %H:%M:%S %z"; }

log() { printf '%s  %s\n' "$(ts)" "$*" >> "$LOG_FILE"; }

if [ ! -r "$ENV_FILE" ]; then
  log "ERR: $ENV_FILE not found or unreadable — create it with CRON_SECRET=…"
  exit 1
fi

# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a

if [ -z "${CRON_SECRET:-}" ]; then
  log "ERR: CRON_SECRET empty in $ENV_FILE"
  exit 1
fi

response=$(curl -sS --max-time 60 -X POST \
  -H "Authorization: Bearer ${CRON_SECRET}" \
  -H "Content-Type: application/json" \
  -w "\n__STATUS__%{http_code}" \
  "$ENDPOINT" 2>&1) || {
    log "ERR: curl failed — $response"
    exit 1
  }

status="${response##*__STATUS__}"
body="${response%__STATUS__*}"

log "HTTP $status :: $body"

if [ "$status" != "200" ]; then
  exit 1
fi
