type MaybeArray<T> = T | T[];

export interface RouteHandlerOptions {
	environment?: MaybeArray<'development' | 'production' | 'test'>;
	properties?: Omit<RouteHandlerProperties, 'isHandler'>;
}

export interface RouteHandlerProperties {
	readonly isHandler?: true;
}
