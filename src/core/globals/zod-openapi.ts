import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';

declare global {
	type RouteZodOpenAPIConfig = Except<RouteConfig, 'description' | 'method' | 'path'>;

	const defineRouteZodOpenAPIConfig: (operationId: string, description: string, config: RouteZodOpenAPIConfig) => RouteZodOpenAPIConfig;
}

setReadonlyConstantToGlobalThis<typeof defineRouteZodOpenAPIConfig>('defineRouteZodOpenAPIConfig', (operationId, description, config) => ({ ...config, description, operationId }));
