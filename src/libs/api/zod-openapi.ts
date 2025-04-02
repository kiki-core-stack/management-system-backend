import type {
    ResponseConfig,
    ZodRequestBody,
} from '@asteasolutions/zod-to-openapi';
import { z } from '@kiki-core-stack/pack/constants/zod';
import { ApiError } from '@kiki-core-stack/pack/hono-backend/libs/api/error';
import type { SetOptional } from 'type-fest';

import type { RouteZodOpenApiConfig } from '@/core/libs/zod-openapi';

const defaultApiRouteZodOpenApiResponsesConfig = Object.freeze<RouteZodOpenApiConfig['responses']>({
    200: defineApiRouteZodOpenApiResponseConfig(),
    500: convertApiErrorToApiRouteZodOpenApiResponseConfig(new ApiError()),
});

export function convertApiErrorToApiRouteZodOpenApiResponseConfig(apiError: ApiError<any, any>) {
    return defineApiRouteZodOpenApiResponseConfig(undefined, apiError.message, apiError.errorCode);
}

export function defineApiRouteZodOpenApiConfig(
    operationId: string,
    description: string,
    config?: SetOptional<RouteZodOpenApiConfig, 'responses'>,
): RouteZodOpenApiConfig {
    return {
        ...config,
        description,
        operationId,
        responses: {
            ...defaultApiRouteZodOpenApiResponsesConfig,
            ...config?.responses,
        },
    };
}

export function defineApiRouteZodOpenApiJsonRequestConfig(
    schema: ReturnType<(typeof z)['object']>,
    description?: string,
): ZodRequestBody {
    return {
        content: { 'application/json': { schema } },
        description,
    };
}

export function defineApiRouteZodOpenApiResponseConfig(
    dataSchema?: ReturnType<(typeof z)['object']>,
    message: string = '成功',
    errorCode?: string,
): ResponseConfig {
    let schema = z.object({
        message: z.string().describe(message),
        success: z.literal(!errorCode),
    });

    if (dataSchema) schema = schema.extend({ data: dataSchema });
    if (errorCode) schema = schema.extend({ errorCode: z.literal(errorCode) });
    return {
        content: { 'application/json': { schema } },
        description: message,
    };
}
