import type { RouteHandlerProperties } from '../types/route';

export const allowedRouteHttpMethods = [
    'delete',
    'get',
    'head',
    'options',
    'patch',
    'post',
    'purge',
    'put',
] as const;

export const allRoutes: Readonly<Record<typeof allowedRouteHttpMethods[number], Record<string, { handlerProperties?: RouteHandlerProperties }>>> = {
    delete: {},
    get: {},
    head: {},
    options: {},
    patch: {},
    post: {},
    purge: {},
    put: {},
};
