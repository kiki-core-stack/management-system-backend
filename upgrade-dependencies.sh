#!/bin/bash

. ./.env.development.local
export NPM_CONFIG_REGISTRY

set -e

pnpm upgrade -L --lockfile-only
bun i
bun update
./modify-files-permissions.sh
