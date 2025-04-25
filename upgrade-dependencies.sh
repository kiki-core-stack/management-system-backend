#!/bin/bash

cd "$(realpath "$(dirname "$(readlink -f "$0")")")"
. ./.env.development.local
export NPM_CONFIG_REGISTRY

set -e

if [[ " $@ " =~ ' -c ' ]]; then
    rm -rf ./bun.lock ./node_modules ./pnpm-lock.yaml
fi

pnpm upgrade -L --lockfile-only
bun i
bun update
./modify-files-permissions.sh
