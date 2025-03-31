import { glob } from 'node:fs/promises';
import {
    join,
    resolve,
    sep,
} from 'node:path';

import type {
    Except,
    WritableDeep,
} from 'type-fest';

import { honoApp } from '../app';
import {
    allowedRouteHttpMethods,
    allRoutes,
} from '../constants/route';
import { zodOpenApiRegistry } from '../constants/zod-openapi';
import type { RouteHandlerOptions } from '../types/route';

function filePathSegmentToRankValue(segment: string, isLast: boolean) {
    if (segment === '*' && isLast) return 1e12;
    if (segment === '*') return 1e10;
    if (segment.startsWith(':') && segment.includes('.')) return 11;
    if (segment.startsWith(':')) return 111;
    return 1;
}

function filePathToRank(path: string) {
    const segments = path.split('/');
    return +segments.map((segment, i) => filePathSegmentToRankValue(segment, i === segments.length - 1)).join('');
}

export async function getRouteDefinitions() {
    const directoryPath = resolve(join(import.meta.dirname, '../../routes')).replaceAll(sep, '/');
    const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    // eslint-disable-next-line style/max-len
    const filePattern = new RegExp(`^${directoryPath}(.*?)(/index)?\\.(${allowedRouteHttpMethods.join('|')})(\\.${environment})?\\.(mj|t)s$`);
    const routeDefinitions = [];
    for await (const filePath of glob(`${directoryPath}/**/*.{mj,t}s`, {})) {
        const matches = filePath.match(filePattern);
        if (!matches) continue;
        const normalizedRoutePath = matches[1]!.replaceAll(/\/+/g, '/');
        routeDefinitions.push({
            filePath,
            method: matches[3]! as typeof allowedRouteHttpMethods[number],
            openApiPath: normalizedRoutePath.replaceAll(/\[([^/]+)\]/g, '{$1}'),
            path: normalizedRoutePath.replaceAll(/\[([^/]+)\]/g, ':$1'),
        });
    }

    return routeDefinitions.sort((a, b) => filePathToRank(a.path) - filePathToRank(b.path));
}

export function loadRouteModule(
    routeModule: any,
    routeDefinition: Except<Awaited<ReturnType<typeof getRouteDefinitions>>[number], 'filePath'>,
) {
    const handlers = [routeModule.default].flat().filter((handler) => handler !== undefined);
    if (!handlers.length) return;
    const latestHandler = handlers.at(-1);
    // eslint-disable-next-line style/max-len
    const routeHandlerOptions: RouteHandlerOptions | undefined = routeModule.handlerOptions || routeModule.options || routeModule.routeHandlerOptions;
    Object.assign(latestHandler, routeHandlerOptions?.properties);
    if (routeModule.zodOpenApiConfig) {
        zodOpenApiRegistry.registerPath({
            ...routeModule.zodOpenApiConfig,
            method: routeDefinition.method,
            path: routeDefinition.openApiPath,
        });
    }

    Object.defineProperty(
        latestHandler,
        'isHandler',
        {
            configurable: false,
            value: true,
            writable: false,
        },
    );

    honoApp.on(routeDefinition.method, routeDefinition.path, ...handlers);
    // eslint-disable-next-line style/max-len
    (allRoutes as WritableDeep<typeof allRoutes>)[routeDefinition.method][routeDefinition.path] = { handlerProperties: routeHandlerOptions?.properties };
}
