#!/bin/bash

. ./.env.development.local
export NPM_REGISTRY=$NPM_REGISTRY
pnpm i
