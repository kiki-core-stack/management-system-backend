import type {
    ResponseConfig,
    ZodRequestBody,
} from '@asteasolutions/zod-to-openapi';
import * as z from '@kiki-core-stack/pack/libs/zod';
import type { Except } from 'type-fest';
import type { ZodObject } from 'zod';

import type { RouteZodOpenApiConfig } from '@/core/libs/zod-openapi';

// Constants
const defaultApiRouteZodOpenApiResponsesConfig = { 200: defineApiRouteZodOpenApiResponseConfig() } as const;

// Functions
export function defineApiRouteZodOpenApiConfig(
    operationId: string,
    description: string,
    tags: Arrayable<string>,
    config?: Except<SetOptional<RouteZodOpenApiConfig, 'responses'>, 'description' | 'operationId' | 'tags'>,
): RouteZodOpenApiConfig {
    return {
        ...config,
        description,
        operationId,
        responses: {
            ...defaultApiRouteZodOpenApiResponsesConfig,
            ...config?.responses,
        },
        tags: Array.isArray(tags) ? tags : [tags],
    };
}

export function defineApiRouteZodOpenApiJsonRequestConfig(schema: ZodObject, description?: string): ZodRequestBody {
    return {
        content: { 'application/json': { schema } },
        description,
    };
}

export function defineApiRouteZodOpenApiResponseConfig(
    dataSchema?: ZodObject,
    message: string = '成功',
    errorCode?: string,
): ResponseConfig {
    let schema = z.object({
        message: z.string().describe(message),
        success: z.literal(!errorCode),
    });

    if (dataSchema) schema = schema.extend({ data: dataSchema });
    if (errorCode !== undefined) schema = schema.extend({ errorCode: z.literal(errorCode) });
    return {
        content: { 'application/json': { schema } },
        description: message,
    };
}
