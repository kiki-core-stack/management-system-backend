import type { H } from 'hono/types';

export type {} from '@kikiutils/kiki-core-stack-pack/types';

interface RouteHandlerProperties {
	isRouteHandler?: boolean;
	noLoginRequired?: boolean;
}

declare global {
	interface ProcessedApiRequestQueries {
		filterQuery: Dict<any>;
		limit: number;
		offset: number;
		page: number;
		selectFields: string[];
		skip: number;
	}

	type RouteHandler = H & Partial<RouteHandlerProperties>;
}
