import type { ReadonlyDeep } from 'type-fest';

import type { Route } from '../types/route';

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

export const allRoutes: ReadonlyDeep<Record<typeof allowedRouteHttpMethods[number], Record<string, Route>>> = {
    delete: {},
    get: {},
    head: {},
    options: {},
    patch: {},
    post: {},
    purge: {},
    put: {},
};
