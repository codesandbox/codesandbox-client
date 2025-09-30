#!/usr/bin/env bash
set -Eeuo pipefail
IFS=$'\n\t'
LOG_DIR="${LOG_DIR:-./logs}"; mkdir -p "$LOG_DIR"
LOG_FILE="${LOG_FILE:-$LOG_DIR/run_$(date -u +%Y%m%dT%H%M%SZ).log}"

log() { printf "[%s] %s\n" "$(date -u +%FT%TZ)" "$*" | tee -a "$LOG_FILE"; }
trap 'status=$?; line=${BASH_LINENO[0]:-?}; log "ERR status=$status line=$line cmd=${BASH_COMMAND}"; exit $status' ERR
trap 'log "EXIT status=$?"' EXIT

retry() { local tries="${2:-3}" delay="${3:-2}" n=0; until "$1"; do n=$((n+1)); (( n>=tries )) && return 1; sleep $((delay*n)); done; }
