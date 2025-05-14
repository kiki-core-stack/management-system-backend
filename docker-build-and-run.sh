#!/bin/bash

set -e

SCRIPT_DIR="$(dirname "$(realpath "${BASH_SOURCE[0]}")")"
cd "$SCRIPT_DIR"

# Load environments
. ./.env.production.local

# Pull images
docker pull oven/bun:slim

# Build and run
docker build \
    -t "$DOCKER_IMAGE_TAG" \
    --build-arg "NPM_REGISTRY=$NPM_REGISTRY" \
    .

docker stop "$DOCKER_CONTAINER_NAME" || true
docker rm "$DOCKER_CONTAINER_NAME" || true
docker run \
    -d \
    --name "$DOCKER_CONTAINER_NAME" \
    --restart=always \
    "$DOCKER_IMAGE_TAG"
