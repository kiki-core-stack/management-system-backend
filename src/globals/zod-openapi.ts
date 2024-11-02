import type { ResponseConfig, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { statusCodeToResponseMessageMap } from '@kikiutils/kiki-core-stack-pack/hono-backend/constants/response';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import { defu } from 'defu';
import { mapValues } from 'lodash-es';
import type { SetOptional } from 'type-fest';

declare global {
	type APIRouteZodOpenAPIConfig = SetOptional<RouteZodOpenAPIConfig, 'responses'>;

	const defineAPIRouteZodOpenAPIConfig: (operationId: string, description: string, config?: APIRouteZodOpenAPIConfig) => RouteZodOpenAPIConfig;
	const defineAPIRouteZodOpenAPIJsonRequestConfig: (schema: ReturnType<(typeof z)['object']>, description?: string) => ZodRequestBody;
	const defineAPIRouteZodOpenAPIJsonResponseConfig: (dataSchema?: ReturnType<(typeof z)['object']>, message?: string, isError?: boolean) => ResponseConfig;
}

setReadonlyConstantToGlobalThis<typeof defineAPIRouteZodOpenAPIConfig>('defineAPIRouteZodOpenAPIConfig', (operationId, description, config) => {
	return defu(
		{
			...config,
			description,
			operationId
		},
		defaultAPIRouteZodOpenAPIConfig
	);
});

setReadonlyConstantToGlobalThis<typeof defineAPIRouteZodOpenAPIJsonRequestConfig>('defineAPIRouteZodOpenAPIJsonRequestConfig', (schema, description) => ({ description, content: { 'application/json': { schema } } }));
setReadonlyConstantToGlobalThis<typeof defineAPIRouteZodOpenAPIJsonResponseConfig>('defineAPIRouteZodOpenAPIJsonResponseConfig', (dataSchema, message = '成功', isError = false) => ({
	description: message,
	content: {
		'application/json': {
			schema: z.object({
				data: dataSchema || z.object({}).optional(),
				message: z.string().describe(message),
				success: z.literal(!isError)
			})
		}
	}
}));

const defaultAPIRouteZodOpenAPIConfig = { responses: mapValues(statusCodeToResponseMessageMap, (message, code) => defineAPIRouteZodOpenAPIJsonResponseConfig(undefined, message, +code >= 400)) };
