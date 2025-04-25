import type { Except } from 'type-fest';

import type { allowedRouteHttpMethods } from '../constants/route';

export interface Route {
    handlerProperties?: RouteHandlerProperties;
}

export interface RouteDefinition {
    filePath: string;
    method: (typeof allowedRouteHttpMethods)[number];
    openApiPath: string;
    path: string;
}

export interface RouteHandlerOptions {
    properties?: Except<RouteHandlerProperties, 'isHandler'>;
}

export interface RouteHandlerProperties {
    readonly isHandler?: true;
}
