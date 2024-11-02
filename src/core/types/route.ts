export interface RouteHandlerOptions {
	environment?: Arrayable<'development' | 'production' | 'test'>;
	properties?: Except<RouteHandlerProperties, 'isHandler'>;
}

export interface RouteHandlerProperties {
	readonly isHandler?: true;
}
