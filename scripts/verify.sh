#!/usr/bin/env bash
set -Eeuo pipefail
source "$(dirname "$0")/common.sh"
log "Start verification"
: "${CI:=false}" "${SEED:=42}"
export NODE_OPTIONS="--max-old-space-size=4096"
retry "npm ci" 3 3
npm run lint --if-present
npm run typecheck --if-present
npm test --if-present -- --ci --runInBand --seed="$SEED" --reporters=default --reporters=jest-junit || npm test --if-present -- --ci --runInBand
log "Verification complete"
