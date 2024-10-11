import type { RouteConfig } from '@hono/zod-openapi';

declare global {
	function defineZodOpenApiRouteConfig(operationId: string, description: string, config: Omit<RouteConfig, 'description' | 'method' | 'operationId' | 'path'>): Omit<RouteConfig, 'method' | 'path'>;
}

globalThis.defineZodOpenApiRouteConfig = (operationId, description, config) => ({ ...config, description, operationId });
