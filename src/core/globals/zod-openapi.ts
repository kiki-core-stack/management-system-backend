import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';

declare global {
	type RouteZodOpenAPIConfig = Omit<RouteConfig, 'description' | 'method' | 'path'>;

	const defineRouteZodOpenAPIConfig: (operationId: string, description: string, config: RouteZodOpenAPIConfig) => RouteZodOpenAPIConfig;
}

setReadonlyConstantToGlobalThis('defineRouteZodOpenAPIConfig', (operationId: string, description: string, config: RouteZodOpenAPIConfig) => ({ ...config, description, operationId }));
