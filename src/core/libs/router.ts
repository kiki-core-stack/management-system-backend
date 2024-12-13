import { glob } from 'glob';
import {
    join,
    resolve,
    sep,
} from 'node:path';
import { env } from 'node:process';
import type { Except } from 'type-fest';

import { zodOpenAPIRegistry } from '@/core/constants/zod-openapi';
import type { RouteHandlerOptions } from '@/core/types/route';

import { honoApp } from '../app';

const allowedHttpMethods = [
    'delete',
    'get',
    'head',
    'options',
    'patch',
    'post',
    'purge',
    'put',
] as const;

function filePathSegmentToRankValue(segment: string, isLast: boolean) {
    if (segment === '*' && isLast) return 1e12;
    if (segment === '*') return 1e10;
    if (segment.startsWith(':') && segment.includes('.')) return 11;
    if (segment.startsWith(':')) return 111;
    return 1;
}

function filePathToRank(path: string) {
    const segments = path.split('/');
    return +segments.map((segment, index) => filePathSegmentToRankValue(segment, index === segments.length - 1)).join('');
}

export async function getRouteDefinitions() {
    const directoryPath = resolve(join(import.meta.dirname, '../../routes')).replaceAll(sep, '/');
    const environment = env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const filePattern = new RegExp(`^${directoryPath}(.*?)(\/index)?\\.(${allowedHttpMethods.join('|')})(\\.${environment})?\\.(mj|t)s$`);
    const routeDefinitions = [];
    for (const filePath of await glob(`${directoryPath}/**/*.{mj,t}s`)) {
        const matches = filePath.match(filePattern);
        if (!matches) continue;
        const normalizedRoutePath = matches[1]!.replaceAll(/\/+/g, '/');
        routeDefinitions.push({
            filePath,
            method: matches[3]!,
            openAPIPath: normalizedRoutePath.replaceAll(/\[([^/]+)\]/g, '{$1}'),
            path: normalizedRoutePath.replaceAll(/\[([^/]+)\]/g, ':$1'),
        });
    }

    return routeDefinitions.sort((a, b) => filePathToRank(a.path) - filePathToRank(b.path));
}

export function loadRouteModule(routeModule: any, routeDefinition: Except<Awaited<ReturnType<typeof getRouteDefinitions>>[number], 'filePath'>) {
    const handlers = [routeModule.default].flat().filter((handler) => handler !== undefined);
    if (!handlers.length) return;
    const latestHandler = handlers.at(-1);
    const routeHandlerOptions: RouteHandlerOptions | undefined = routeModule.handlerOptions || routeModule.options || routeModule.routeHandlerOptions;
    if (routeHandlerOptions) Object.assign(latestHandler, routeHandlerOptions.properties);
    if (routeModule.zodOpenAPIConfig) {
        zodOpenAPIRegistry.registerPath({
            ...routeModule.zodOpenAPIConfig,
            method: routeDefinition.method,
            path: routeDefinition.openAPIPath,
        });
    }

    Object.defineProperty(latestHandler, 'isHandler', {
        configurable: false,
        value: true,
        writable: false,
    });

    honoApp.on(routeDefinition.method, routeDefinition.path, ...handlers);
}
