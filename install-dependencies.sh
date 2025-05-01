#!/bin/bash

cd "$(realpath "$(dirname "$(readlink -f "$0")")")" || exit 1

. ./.env.development.local
export NPM_CONFIG_REGISTRY

bun i
./modify-files-permissions.sh
