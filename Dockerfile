# Build stage
FROM kikikanri/node22:base-alpine AS build-stage

## Set args, envs and workdir
ARG NPM_CONFIG_REGISTRY
ENV NPM_CONFIG_REGISTRY=${NPM_CONFIG_REGISTRY}
WORKDIR /app

## Install dependencies
COPY ./package.json ./pnpm-lock.yaml ./
RUN --mount=id=pnpm-store,target=/pnpm/store,type=cache pnpm i --frozen-lockfile

## Set production env
ENV NODE_ENV=production

## Copy files and build
COPY ./src ./src
COPY ./ts-project-builder.config.mjs ./tsconfig.json ./
RUN pnpm run build

# Runtime stage
FROM node:22-slim

## Set args, envs and workdir
ENV NODE_ENV=production
ENV PNPM_HOME=/pnpm
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=8000
WORKDIR /app

## Set timezone and upgrade packages
RUN apt-get update && apt-get upgrade -y
RUN apt install -y --no-install-recommends tzdata
RUN ln -fs /usr/share/zoneinfo/Asia/Taipei /etc/localtime && dpkg-reconfigure --frontend noninteractive tzdata
RUN apt-get clean && rm -rf /tmp/* /var/lib/apt/lists/* /var/tmp/*

## Install dependencies
RUN npm i pnpm@latest -g
COPY --from=build-stage /app/package.json /app/pnpm-lock.yaml ./
RUN --mount=id=pnpm-store,target=/pnpm/store,type=cache pnpm i --frozen-lockfile

## Copy files and libraries
COPY --from=build-stage /app/dist ./
COPY ./docker-run-cluster.mjs ./

## Set cmd
CMD ["node", "./docker-run-cluster.mjs"]
