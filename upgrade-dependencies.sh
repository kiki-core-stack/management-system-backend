#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"
cd "${SCRIPT_DIR}"

set +e

. ./.env.development.local
export NPM_CONFIG_REGISTRY

[[ " $@ " =~ ' -c ' ]] && rm -rf ./bun.lock ./node_modules ./pnpm-lock.yaml

pnpm upgrade -L --lockfile-only &&
    bun i &&
    bun update

./modify-files-permissions.sh
