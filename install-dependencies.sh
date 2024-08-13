#!/bin/bash

. ./.env.development.local
export NPMRC_REGISTRY=$NPMRC_REGISTRY
bun i
