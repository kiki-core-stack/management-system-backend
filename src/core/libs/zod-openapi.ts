import {
    OpenApiGeneratorV31,
    OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import type { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { getEnumNumberValues } from '@kikiutils/shared/enum';
import type { SchemaObject } from 'openapi3-ts/oas31';
import type { Except } from 'type-fest';
import * as z from 'zod';
import type {
    EnumLike,
    ZodEffects,
    ZodNativeEnum,
} from 'zod';

export type RouteZodOpenApiConfig = Except<RouteConfig, 'method' | 'path'>;

export const defineRouteZodOpenApiConfig = (config: RouteZodOpenApiConfig): RouteZodOpenApiConfig => config;

export function numberEnumToZodOpenApiSchema<T extends EnumLike>(
    enumName: string,
    enumObject: T,
    toTextMap?: Record<number | string, string>,
) {
    const baseSchema = z.nativeEnum(enumObject);
    const schema = z.preprocess(
        (value) => typeof value === 'number' || typeof value === 'string' ? +value : value,
        baseSchema,
    );

    // Remove it if you need OpenAPI metadata in production
    if (process.env.NODE_ENV === 'production') return schema as ZodEffects<ZodNativeEnum<T>>;
    return schema.openapi(
        enumName,
        {
            'x-enum-descriptions': toTextMap
                ? getEnumNumberValues(enumObject).map((key: number) => toTextMap[key])
                : undefined,
            'x-enum-varnames': Object.keys(enumObject).filter((key) => !Number.isFinite(+key)),
        },
    ) as ZodEffects<ZodNativeEnum<T>>;
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
