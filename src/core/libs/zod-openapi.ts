import {
    OpenApiGeneratorV31,
    OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { getEnumNumberValues } from '@kikiutils/node/enum';
import type { SchemaObject } from 'openapi3-ts/oas31';
import type { Except } from 'type-fest';
import * as z from 'zod';
import type { EnumLike } from 'zod';

export type RouteZodOpenApiConfig = Except<RouteConfig, 'method' | 'path'>;

export const defineRouteZodOpenApiConfig = (config: RouteZodOpenApiConfig) => config;

export function numberEnumToZodOpenApiSchema<T extends EnumLike>(
    enumName: string,
    enumObject: T,
    toTextMap?: Record<number | string, string>,
) {
    return z.nativeEnum(enumObject).openapi(
        enumName,
        {
            'x-enum-descriptions': toTextMap
                ? getEnumNumberValues(enumObject).map((key: number) => toTextMap[key])
                : undefined,
            'x-enum-varnames': Object.keys(enumObject).filter((key) => !Number.isFinite(+key)),
        },
    );
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
