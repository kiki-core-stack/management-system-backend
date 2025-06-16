#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"
cd "${SCRIPT_DIR}"

set +e

. ./.env.development.local
export NPM_CONFIG_REGISTRY

pnpm i --lockfile-only
bun i
./modify-files-permissions.sh
