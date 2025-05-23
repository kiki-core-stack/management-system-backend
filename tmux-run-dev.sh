#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"
cd "${SCRIPT_DIR}"

SESSION_NAME='kiki-core-stack-admin-backend'

if ! tmux ls | grep -q "^${SESSION_NAME}:"; then
    tmux new-session -ds "${SESSION_NAME}"
    tmux send-keys -t "${SESSION_NAME}" 'bun run dev' C-m
fi
