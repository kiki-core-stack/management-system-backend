#!/bin/bash

. ./.env.development.local
export NPM_REGISTRY
pnpm upgrade -L
