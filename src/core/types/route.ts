import type { Except } from 'type-fest';

export interface Route {
    handlerProperties?: RouteHandlerProperties;
}

export interface RouteHandlerOptions {
    properties?: Except<RouteHandlerProperties, 'isHandler'>;
}

export interface RouteHandlerProperties {
    readonly isHandler?: true;
}
