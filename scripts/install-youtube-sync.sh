#!/usr/bin/env bash
# One-shot installer for the daily YouTube shorts sync on macOS.
#
#   - Copies scripts/com.troublebaba.youtube-sync.plist into ~/Library/LaunchAgents
#     with the absolute repo path substituted in.
#   - Loads it under the current user's launchd domain.
#
# Re-running is safe — it unloads + reloads the agent with the updated path.
#
# After install, edit ~/.troublebaba.env (created if missing) and put your
# CRON_SECRET there. Then test with:
#   launchctl kickstart -k gui/$(id -u)/com.troublebaba.youtube-sync
#   tail -f ~/Library/Logs/troublebaba/youtube-sync.log

set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLIST_SRC="${REPO_DIR}/scripts/com.troublebaba.youtube-sync.plist"
PLIST_DST="${HOME}/Library/LaunchAgents/com.troublebaba.youtube-sync.plist"
ENV_FILE="${HOME}/.troublebaba.env"
LABEL="com.troublebaba.youtube-sync"

mkdir -p "${HOME}/Library/LaunchAgents"

# Substitute the repo path into the plist on copy.
sed "s|__ABS_REPO_PATH__|${REPO_DIR}|g" "$PLIST_SRC" > "$PLIST_DST"
chmod 0644 "$PLIST_DST"

# Make sure the runner script is executable.
chmod +x "${REPO_DIR}/scripts/youtube-sync.sh"

# Reload if already installed; otherwise just bootstrap.
if launchctl print "gui/$(id -u)/${LABEL}" >/dev/null 2>&1; then
  launchctl bootout "gui/$(id -u)/${LABEL}" || true
fi
launchctl bootstrap "gui/$(id -u)" "$PLIST_DST"

# Create env file stub if missing.
if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<EOF
# troublebaba.com — local secrets for cron jobs. DO NOT COMMIT.
# Paste the same CRON_SECRET you set in Cloudflare Pages env vars.
CRON_SECRET=
EOF
  chmod 0600 "$ENV_FILE"
  echo
  echo "Created ${ENV_FILE}"
  echo "→ Open it and paste your CRON_SECRET, then run:"
  echo "    launchctl kickstart -k gui/\$(id -u)/${LABEL}"
  echo "    tail -f ~/Library/Logs/troublebaba/youtube-sync.log"
else
  echo "Existing ${ENV_FILE} kept as-is."
fi

echo
echo "✓ Installed. Next fire: today at 12:00 local (or on next wake if past)."
echo "  Manual trigger: launchctl kickstart -k gui/\$(id -u)/${LABEL}"
echo "  Uninstall:      launchctl bootout gui/\$(id -u)/${LABEL}"
