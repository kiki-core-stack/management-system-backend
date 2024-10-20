import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';

declare global {
	type RouteZodOpenAPIConfig = Omit<RouteConfig, 'method' | 'path'>;

	const defineRouteZodOpenAPIConfig: (operationId: string, config: RouteZodOpenAPIConfig) => RouteZodOpenAPIConfig;
}

setReadonlyConstantToGlobalThis('defineRouteZodOpenAPIConfig', (operationId: string, config: RouteZodOpenAPIConfig) => ({ ...config, operationId }));
