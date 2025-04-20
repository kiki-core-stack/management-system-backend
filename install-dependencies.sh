#!/bin/bash

. ./.env.development.local
export NPM_CONFIG_REGISTRY

set -e

bun i
./modify-files-permissions.sh
