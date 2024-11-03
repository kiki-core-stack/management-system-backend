export interface RouteHandlerOptions {
	properties?: Except<RouteHandlerProperties, 'isHandler'>;
}

export interface RouteHandlerProperties {
	readonly isHandler?: true;
}
