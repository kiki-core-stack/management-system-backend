# Build stage
FROM oven/bun:slim AS build-stage

## Set args, envs and workdir
ARG NPM_CONFIG_REGISTRY
ENV NODE_ENV=production \
    NPM_CONFIG_REGISTRY=$NPM_CONFIG_REGISTRY

WORKDIR /app

## Upgrade packages
RUN apt-get update && \
    apt-get upgrade -y

## Copy package-related files and install dependencies
COPY ./bun.lock ./package.json ./
RUN bun i --frozen-lockfile

## Copy source files and build-related files, then build the app
COPY ./src ./src
COPY ./.env.production.local ./eslint.config.mjs ./tsconfig.json ./
RUN bun run lint && \
    bun run type-check && \
    bun run build

# Runtime stage
FROM oven/bun:slim

## Set envs and workdir
ENV NODE_ENV=production \
    SERVER_HOST=0.0.0.0 \
    TZ=Asia/Taipei

WORKDIR /app

## Upgrade, install packages and set timezone
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y --no-install-recommends tini tzdata && \
    ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apt-get autoremove -y --purge && \
    apt-get clean && \
    rm -rf /var/cache/apt/* /var/lib/apt/lists/*

## Copy files and libraries
COPY --from=build-stage /app/dist ./
COPY ./.env.production.local ./.env
COPY ./node_modules/svg-captcha/fonts ./node_modules/svg-captcha/fonts

## Copy and set the entrypoint script
COPY ./docker-entrypoint.sh ./
ENTRYPOINT ["tini", "--"]
CMD ["./docker-entrypoint.sh"]
