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

export const allRoutes: ReadonlyRecord<
    typeof allowedRouteHttpMethods[number],
    ReadonlyRecord<string, { handlerProperties?: RouteHandlerProperties }>
> = {
    delete: {},
    get: {},
    head: {},
    options: {},
    patch: {},
    post: {},
    purge: {},
    put: {},
};
