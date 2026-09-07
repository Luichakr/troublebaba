#!/usr/bin/env bash
# Универсальный вызов cron-эндпоинтов troublebaba.com.
#
# Заменяет копипасту youtube-sync.sh: те же проверки, тот же формат лога,
# но эндпоинт передаётся аргументом. youtube-sync.sh оставлен как есть,
# чтобы не ломать уже установленный launchd-агент.
#
# Использование:
#   scripts/cron-call.sh youtube-sync
#   scripts/cron-call.sh social-sync
#
# Секрет читается из ~/.troublebaba.env (CRON_SECRET=…), в репозиторий
# не попадает.
#
# Лог: ~/Library/Logs/troublebaba/<job>.log

set -u

JOB="${1:-}"
if [ -z "$JOB" ]; then
  echo "Использование: $0 <youtube-sync|social-sync>" >&2
  exit 2
fi

ENDPOINT="https://troublebaba.com/api/cron/${JOB}"
ENV_FILE="${HOME}/.troublebaba.env"
LOG_DIR="${HOME}/Library/Logs/troublebaba"
LOG_FILE="${LOG_DIR}/${JOB}.log"

mkdir -p "$LOG_DIR"
ts() { date "+%Y-%m-%d %H:%M:%S %z"; }
log() { printf '%s  %s\n' "$(ts)" "$*" >> "$LOG_FILE"; }

if [ ! -r "$ENV_FILE" ]; then
  log "ERR: $ENV_FILE не найден — создай его со строкой CRON_SECRET=…"
  exit 1
fi

# shellcheck disable=SC1090
set -a; . "$ENV_FILE"; set +a

TOKEN="${CRON_TOKEN:-${CRON_SECRET:-}}"
if [ -z "$TOKEN" ]; then
  log "ERR: ни CRON_TOKEN, ни CRON_SECRET не заданы в $ENV_FILE"
  exit 1
fi

response=$(curl -sS --max-time 60 -X POST \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -w "\n__STATUS__%{http_code}" \
  "$ENDPOINT" 2>&1) || { log "ERR: curl упал — $response"; exit 1; }

status="${response##*__STATUS__}"
body="${response%__STATUS__*}"
log "HTTP $status :: $body"
[ "$status" = "200" ]
