import type {
    ResponseConfig,
    ZodRequestBody,
} from '@asteasolutions/zod-to-openapi';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import { getEnumNumberValues } from '@kikiutils/node/enum';
import type { SetOptional } from 'type-fest';
import type {
    EnumLike,
    ZodNativeEnum,
} from 'zod';

declare global {
    type ApiRouteZodOpenApiConfig = SetOptional<RouteZodOpenApiConfig, 'responses'>;

    const defineApiRouteZodOpenApiConfig: (
        operationId: string,
        description: string,
        config?: ApiRouteZodOpenApiConfig
    ) => RouteZodOpenApiConfig;

    const defineApiRouteZodOpenApiJsonRequestConfig: (
        schema: ReturnType<(typeof z)['object']>,
        description?: string
    ) => ZodRequestBody;

    const defineApiRouteZodOpenApiJsonResponseConfig: (
        dataSchema?: ReturnType<(typeof z)['object']>,
        message?: string,
        isError?: boolean
    ) => ResponseConfig;

    const numberEnumToZodOpenApiSchema: <T extends EnumLike>(
        enumName: string,
        enumObject: T,
        toTextMap?: Record<number | string, string>
    ) => ZodNativeEnum<T>;
}

setReadonlyConstantToGlobalThis<typeof defineApiRouteZodOpenApiJsonResponseConfig>(
    'defineApiRouteZodOpenApiJsonResponseConfig',
    (dataSchema, message = '成功', isError = false) => ({
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
    }),
);

// eslint-disable-next-line style/max-len
const defaultApiRouteZodOpenApiResponsesConfig = Object.freeze({ 200: defineApiRouteZodOpenApiJsonResponseConfig(undefined, '成功') });
setReadonlyConstantToGlobalThis<typeof defineApiRouteZodOpenApiConfig>(
    'defineApiRouteZodOpenApiConfig',
    (operationId, description, config) => ({
        ...config,
        description,
        operationId,
        responses: {
            ...defaultApiRouteZodOpenApiResponsesConfig,
            ...config?.responses,
        },
    }),
);

setReadonlyConstantToGlobalThis<typeof defineApiRouteZodOpenApiJsonRequestConfig>(
    'defineApiRouteZodOpenApiJsonRequestConfig',
    (schema, description) => ({
        content: { 'application/json': { schema } },
        description,
    }),
);

setReadonlyConstantToGlobalThis<typeof numberEnumToZodOpenApiSchema>(
    'numberEnumToZodOpenApiSchema',
    (enumName, enumObject, toTextMap) => {
        return z.nativeEnum(enumObject).openapi(
            enumName,
            {
                'x-enum-descriptions': toTextMap
                    ? getEnumNumberValues(enumObject).map((key: number) => toTextMap[key])
                    : undefined,
                'x-enum-varnames': Object.keys(enumObject).filter((key) => !Number.isFinite(+key)),
            },
        );
    },
);
