import {
    OpenApiGeneratorV31,
    OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import type { SchemaObject } from 'openapi3-ts/oas31';
import type { Except } from 'type-fest';
import type { z } from 'zod';

export type RouteZodOpenApiConfig = Except<RouteConfig, 'method' | 'path'>;

export function defineRouteZodOpenApiConfig(
    operationId: string,
    description: string,
    config: RouteZodOpenApiConfig,
): RouteZodOpenApiConfig {
    return {
        ...config,
        description,
        operationId,
    };
}

export function zodSchemaToOpenApiSchema(schema: ReturnType<(typeof z)['object']>, description?: string): SchemaObject {
    const registry = new OpenAPIRegistry();
    registry.register('schema', schema);
    return {
        ...new OpenApiGeneratorV31(registry.definitions)
            .generateComponents()
            .components!
            .schemas!
            .schema,
        description,
    };
}
