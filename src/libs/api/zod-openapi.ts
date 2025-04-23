import type {
    ResponseConfig,
    ZodRequestBody,
} from '@asteasolutions/zod-to-openapi';
import { ApiError } from '@kiki-core-stack/pack/hono-backend/libs/api/error';
import * as z from '@kiki-core-stack/pack/libs/zod';

import { zodSchemaToOpenApiSchema } from '@/core/libs/zod-openapi';
import type { RouteZodOpenApiConfig } from '@/core/libs/zod-openapi';

const defaultApiRouteZodOpenApiResponsesConfig = {
    200: defineApiRouteZodOpenApiResponseConfig(),
    500: convertApiErrorToApiRouteZodOpenApiResponseConfig(new ApiError()),
} as const;

export function convertApiErrorToApiRouteZodOpenApiResponseConfig(apiError: ApiError<any, any>) {
    return defineApiRouteZodOpenApiResponseConfig(undefined, apiError.message, apiError.errorCode);
}

export function convertApiErrorsToApiRouteZodOpenApiResponsesConfig(
    apiErrors: ApiError<any, any>[] | Record<string, ApiError<any, any>>,
) {
    const errors = Array.isArray(apiErrors) ? apiErrors : Object.values(apiErrors);
    const errorsGroup: Record<string, ApiError<any, any>[]> = {};
    errors.forEach((error) => (errorsGroup[error.statusCode] ||= []).push(error));
    const responses: RouteZodOpenApiConfig['responses'] = {};
    Object.entries(errorsGroup).forEach(([statusCode, errors]) => {
        const descriptions: string[] = [];
        const schemas = errors.map((error) => {
            descriptions.push(error.message);
            return zodSchemaToOpenApiSchema(
                z.object({
                    errorCode: z.literal(error.errorCode),
                    message: z.string().describe(error.message),
                    success: z.literal(false),
                }),
                error.message,
            );
        });

        responses[statusCode] = {
            content: { 'application/json': { schema: schemas.length === 1 ? schemas[0]! : { oneOf: schemas } } },
            description: descriptions.join('｜'),
        };
    });

    return responses;
}

export function defineApiRouteZodOpenApiConfig(
    operationId: string,
    description: string,
    tags: string[],
    config?: Except<SetOptional<RouteZodOpenApiConfig, 'responses'>, 'description' | 'operationId' | 'tags'>,
    apiErrors?: ApiError<any, any>[] | Record<string, ApiError<any, any>>,
): RouteZodOpenApiConfig {
    return {
        ...config,
        description,
        operationId,
        responses: {
            ...defaultApiRouteZodOpenApiResponsesConfig,
            ...config?.responses,
            ...apiErrors && convertApiErrorsToApiRouteZodOpenApiResponsesConfig(apiErrors),
        },
        tags,
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
