#!/bin/bash

. ./.env.development.local
export NPM_CONFIG_REGISTRY
pnpm upgrade -L
