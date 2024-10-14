# Build stage
FROM kikikanri/node22:base-alpine AS build-stage

## Set args, envs and workdir
ARG NPM_CONFIG_REGISTRY
ENV NPM_CONFIG_REGISTRY=${NPM_CONFIG_REGISTRY}
WORKDIR /app

## Install dependencies
COPY ./.npmrc ./package.json ./pnpm-lock.yaml ./
RUN --mount=id=pnpm-store,target=/pnpm/store,type=cache pnpm i --frozen-lockfile

## Set production env
ENV NODE_ENV=production

## Copy files and build
COPY ./src ./src
COPY ./ts-project-builder.config.mjs ./tsconfig.json ./
RUN pnpm run build

# Runtime stage
FROM kikikanri/node22:base-alpine

## Set args, envs and workdir
ENV NODE_ENV=production
ENV SERVER_HOST=127.0.0.1
ENV SERVER_PORT=8000
WORKDIR /app

## Set timezone and upgrade packages
RUN apk update && apk upgrade --no-cache
RUN apk add -lu --no-cache tzdata && ln -s /usr/share/zoneinfo/Asia/Taipei /etc/localtime

## Install dependencies
COPY --from=build-stage /app/.npmrc /app/package.json /app/pnpm-lock.yaml ./
RUN --mount=id=pnpm-store,target=/pnpm/store,type=cache pnpm i --frozen-lockfile

## Copy files and libraries
COPY --from=build-stage /app/dist ./dist

## Set cmd
CMD ["node", "./dist/index.mjs"]
