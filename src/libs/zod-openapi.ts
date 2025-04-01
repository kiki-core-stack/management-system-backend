import type { ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { z } from '@kiki-core-stack/pack/constants/zod';
import type { SetOptional } from 'type-fest';

import type { RouteZodOpenApiConfig } from '@/core/libs/zod-openapi';

const defaultApiRouteZodOpenApiResponsesConfig = Object.freeze<RouteZodOpenApiConfig['responses']>({
    200: {
        content: {
            'application/json': {
                schema: z.object({
                    message: z.string().describe('成功！'),
                    success: z.literal(true),
                }),
            },
        },
        description: '成功！',
    },
    500: {
        content: {
            'application/json': {
                schema: z.object({
                    errorCode: z.literal('internalServerError'),
                    message: z.string().describe('系統錯誤！'),
                    success: z.literal(false),
                }),
            },
        },
        description: '系統錯誤！',
    },
});

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
