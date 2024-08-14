#!/bin/bash

. ./.env.development.local
export NPMRC_REGISTRY=$NPMRC_REGISTRY
pnpm i
