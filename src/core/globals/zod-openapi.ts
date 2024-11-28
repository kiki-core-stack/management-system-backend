import { OpenApiGeneratorV31, OpenAPIRegistry } from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { SchemaObject } from 'openapi3-ts/oas31';
import type { Except } from 'type-fest';
import type { z } from 'zod';

declare global {
    type RouteZodOpenAPIConfig = Except<RouteConfig, 'description' | 'method' | 'path'>;

    const defineRouteZodOpenAPIConfig: (operationId: string, description: string, config: RouteZodOpenAPIConfig) => RouteZodOpenAPIConfig;
    const zodSchemaToOpenAPISchema: (schema: ReturnType<(typeof z)['object']>, description?: string) => SchemaObject;
}

setReadonlyConstantToGlobalThis<typeof defineRouteZodOpenAPIConfig>('defineRouteZodOpenAPIConfig', (operationId, description, config) => ({ ...config, description, operationId }));
setReadonlyConstantToGlobalThis<typeof zodSchemaToOpenAPISchema>('zodSchemaToOpenAPISchema', (schema, description) => {
    const registry = new OpenAPIRegistry();
    registry.register('schema', schema);
    return { ...new OpenApiGeneratorV31(registry.definitions).generateComponents().components!.schemas!.schema as SchemaObject, description };
});
