# Build stage
FROM oven/bun:slim AS build-stage

## Set args, envs and workdir
ARG NPM_CONFIG_REGISTRY
ENV NODE_ENV='production' \
    NPM_CONFIG_REGISTRY="${NPM_CONFIG_REGISTRY}"

WORKDIR /app

## Upgrade packages
RUN apt-get update && \
    apt-get upgrade -y

## Copy package-related files and install dependencies
COPY ./bun.lock ./package.json ./
RUN bun i --frozen-lockfile

## Copy source files and build-related files, then build the app
COPY ./.env.production.local ./.gitignore ./eslint.config.mjs ./tsconfig.json ./
COPY ./src ./src
RUN bun run lint && \
    bun run typecheck && \
    bun run build

# Runtime stage
FROM oven/bun:slim

## Set envs and workdir
ENV NODE_ENV='production' \
    SERVER_HOST='0.0.0.0' \
    SERVER_PORT=8000 \
    TZ='UTC'

WORKDIR /app

## Upgrade, install packages and set timezone
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends tini tzdata && \
    ln -snf "/usr/share/zoneinfo/${TZ}" /etc/localtime && \
    echo "${TZ}" >/etc/timezone && \
    apt-get autoremove -y --purge && \
    apt-get clean && \
    rm -rf /var/cache/apt/* /var/lib/apt/lists/*

## Copy files and libraries
COPY --from=build-stage /app/dist ./
COPY ./.env.production.local ./.env

## Copy and set the entrypoint script
ADD --chmod=700 ./docker-entrypoint.sh ./
ENTRYPOINT ["tini", "--"]
CMD ["./docker-entrypoint.sh"]
