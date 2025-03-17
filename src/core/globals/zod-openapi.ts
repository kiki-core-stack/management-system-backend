import {
    OpenApiGeneratorV31,
    OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { SchemaObject } from 'openapi3-ts/oas31';

declare global {
    type RouteZodOpenApiConfig = Except<RouteConfig, 'description' | 'method' | 'path'>;

    const defineRouteZodOpenApiConfig: (
        operationId: string,
        description: string,
        config: RouteZodOpenApiConfig
    ) => RouteZodOpenApiConfig;

    const zodSchemaToOpenApiSchema: (schema: ReturnType<(typeof z)['object']>, description?: string) => SchemaObject;
}

setReadonlyConstantToGlobalThis<typeof defineRouteZodOpenApiConfig>(
    'defineRouteZodOpenApiConfig',
    (operationId, description, config) => ({
        ...config,
        description,
        operationId,
    }),
);

setReadonlyConstantToGlobalThis<typeof zodSchemaToOpenApiSchema>('zodSchemaToOpenApiSchema', (schema, description) => {
    const registry = new OpenAPIRegistry();
    registry.register('schema', schema);
    return {
        ...new OpenApiGeneratorV31(registry.definitions)
            .generateComponents()
            .components!
            .schemas!
            .schema as SchemaObject,
        description,
    };
});
