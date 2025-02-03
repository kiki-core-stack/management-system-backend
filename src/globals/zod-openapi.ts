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
    type APIRouteZodOpenAPIConfig = SetOptional<RouteZodOpenAPIConfig, 'responses'>;

    const defineAPIRouteZodOpenAPIConfig: (operationId: string, description: string, config?: APIRouteZodOpenAPIConfig) => RouteZodOpenAPIConfig;
    const defineAPIRouteZodOpenAPIJsonRequestConfig: (schema: ReturnType<(typeof z)['object']>, description?: string) => ZodRequestBody;
    const defineAPIRouteZodOpenAPIJsonResponseConfig: (dataSchema?: ReturnType<(typeof z)['object']>, message?: string, isError?: boolean) => ResponseConfig;
    const numberEnumToZodOpenAPISchema: (enumName: string, enumObject: EnumLike, toTextMap?: Record<number | string, string>) => ZodNativeEnum<EnumLike>;
}

setReadonlyConstantToGlobalThis<typeof defineAPIRouteZodOpenAPIJsonResponseConfig>('defineAPIRouteZodOpenAPIJsonResponseConfig', (dataSchema, message = '成功', isError = false) => ({
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
}));

const defaultAPIRouteZodOpenAPIResponsesConfig = Object.freeze({ 200: defineAPIRouteZodOpenAPIJsonResponseConfig(undefined, '成功') });
setReadonlyConstantToGlobalThis<typeof defineAPIRouteZodOpenAPIConfig>('defineAPIRouteZodOpenAPIConfig', (operationId, description, config) => ({
    ...config,
    description,
    operationId,
    responses: {
        ...defaultAPIRouteZodOpenAPIResponsesConfig,
        ...config?.responses,
    },
}));

setReadonlyConstantToGlobalThis<typeof defineAPIRouteZodOpenAPIJsonRequestConfig>('defineAPIRouteZodOpenAPIJsonRequestConfig', (schema, description) => ({
    content: { 'application/json': { schema } },
    description,
}));

setReadonlyConstantToGlobalThis<typeof numberEnumToZodOpenAPISchema>('numberEnumToZodOpenAPISchema', (enumName, enumObject, toTextMap) => {
    return z.nativeEnum(enumObject).openapi(
        enumName,
        {
            'x-enum-descriptions': toTextMap ? getEnumNumberValues(enumObject).map((key: number) => toTextMap[key]) : undefined,
            'x-enum-varnames': Object.keys(enumObject).filter((key) => !Number.isFinite(+key)),
        },
    );
});
