import type { ResponseConfig, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { SetOptional } from 'type-fest';

declare global {
    type APIRouteZodOpenAPIConfig = SetOptional<RouteZodOpenAPIConfig, 'responses'>;

    const defineAPIRouteZodOpenAPIConfig: (operationId: string, description: string, config?: APIRouteZodOpenAPIConfig) => RouteZodOpenAPIConfig;
    const defineAPIRouteZodOpenAPIJsonRequestConfig: (schema: ReturnType<(typeof z)['object']>, description?: string) => ZodRequestBody;
    const defineAPIRouteZodOpenAPIJsonResponseConfig: (dataSchema?: ReturnType<(typeof z)['object']>, message?: string, isError?: boolean) => ResponseConfig;
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
    responses: { ...defaultAPIRouteZodOpenAPIResponsesConfig, ...config?.responses },
}));

setReadonlyConstantToGlobalThis<typeof defineAPIRouteZodOpenAPIJsonRequestConfig>('defineAPIRouteZodOpenAPIJsonRequestConfig', (schema, description) => ({ content: { 'application/json': { schema } }, description }));
