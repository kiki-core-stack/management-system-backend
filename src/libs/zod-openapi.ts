import type {
    ResponseConfig,
    ZodRequestBody,
} from '@asteasolutions/zod-to-openapi';
import type { SetOptional } from 'type-fest';
import { z } from '@kiki-core-stack/pack/constants/zod';

import type { RouteZodOpenApiConfig } from '@/core/libs/zod-openapi';

export type ApiRouteZodOpenApiConfig = SetOptional<RouteZodOpenApiConfig, 'responses'>;

const defaultApiRouteZodOpenApiResponsesConfig = Object.freeze({
    200: defineApiRouteZodOpenApiJsonResponseConfig(undefined, '成功'),
    500: defineApiRouteZodOpenApiJsonResponseConfig(undefined, '系統錯誤！'),
});

export function defineApiRouteZodOpenApiConfig(
    operationId: string,
    description: string,
    config?: ApiRouteZodOpenApiConfig,
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

export function defineApiRouteZodOpenApiJsonResponseConfig(
    dataSchema?: ReturnType<(typeof z)['object']>,
    message: string = '成功',
    isError: boolean = false,
): ResponseConfig {
    return {
        content: {
            'application/json': {
                schema: z.object({
                    data: dataSchema || z.object({}).optional(),
                    message: z.string().describe(message),
                    success: z.literal(!isError),
                }),
            },
        },
        description: message,
    };
}
