# Build stage
FROM oven/bun:slim AS build-stage

## Upgrade packages
RUN apt-get update && apt-get upgrade -y

## Set args, envs and workdir
ARG NPM_CONFIG_REGISTRY
ENV NODE_ENV=production \
    NPM_CONFIG_REGISTRY=$NPM_CONFIG_REGISTRY

WORKDIR /app

## Copy package-related files and install dependencies
COPY ./bun.lock ./package.json ./
RUN bun i --frozen-lockfile

## Copy source files and build-related files, then build the app
COPY ./src ./src
COPY ./.env.production.local ./eslint.config.mjs ./tsconfig.json ./
RUN bun run lint && bun run type-check && bun run build

# Runtime stage
FROM oven/bun:slim

## Set envs and workdir
ENV NODE_ENV=production \
    TZ=UTC

WORKDIR /app

## Install required runtime dependencies and set timezone in one step
RUN apt-get update && \
    apt-get install -y --no-install-recommends tini tzdata && \
    ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apt-get clean && \
    rm -rf /var/cache/apt/* /var/lib/apt/lists/*

## Copy files and libraries
COPY --from=build-stage /app/dist ./
COPY ./.env.production.local ./.env

## Copy and set the entrypoint script
COPY ./docker-entrypoint.sh ./
ENTRYPOINT ["tini", "--"]
CMD ["./docker-entrypoint.sh"]
