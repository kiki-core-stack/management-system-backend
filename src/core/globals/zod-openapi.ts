import type { RouteConfig } from '@hono/zod-openapi';

declare global {
	function createZodOpenApiRouteConfig(operationId: string, description: string, config: Omit<RouteConfig, 'description' | 'method' | 'operationId' | 'path'>): Omit<RouteConfig, 'method' | 'path'>;
}

globalThis.createZodOpenApiRouteConfig = (operationId, description, config) => ({ ...config, description, operationId });
