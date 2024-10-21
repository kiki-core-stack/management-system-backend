import type { ResponseConfig, ZodRequestBody } from '@asteasolutions/zod-to-openapi';
import { statusCodeToResponseMessageMap } from '@kikiutils/kiki-core-stack-pack/hono-backend/constants/response';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import { defu } from 'defu';
import { mapValues } from 'lodash-es';
import type { SetOptional } from 'type-fest';

declare global {
	type APIRouteZodOpenAPIConfig = SetOptional<Omit<RouteZodOpenAPIConfig, 'description'>, 'responses'>;

	const defineAPIRouteZodOpenAPIConfig: (operationId: string, description: string, config?: APIRouteZodOpenAPIConfig) => RouteZodOpenAPIConfig;
	const defineAPIRouteZodOpenAPIJsonRequestConfig: (schema?: ReturnType<(typeof z)['object']>, description?: string) => ZodRequestBody;
	const defineAPIRouteZodOpenAPIJsonResponseConfig: (dataSchema?: ReturnType<(typeof z)['object']>, message?: string, isError?: boolean) => ResponseConfig;
}

setReadonlyConstantToGlobalThis('defineAPIRouteZodOpenAPIConfig', (operationId: string, description: string, config?: APIRouteZodOpenAPIConfig) => {
	return defu(
		{
			...config,
			description,
			operationId
		},
		defaultAPIRouteZodOpenAPIConfig
	);
});

setReadonlyConstantToGlobalThis('defineAPIRouteZodOpenAPIJsonRequestConfig', (schema?: ReturnType<(typeof z)['object']>, description?: string) => ({ description, content: { 'application/json': { schema } } }));
setReadonlyConstantToGlobalThis('defineAPIRouteZodOpenAPIJsonResponseConfig', (dataSchema?: ReturnType<(typeof z)['object']>, message: string = '成功', isError: boolean = false) => ({
	description: message,
	content: {
		'application/json': {
			schema: z.object({
				data: dataSchema || z.object({}),
				message: z.string().describe(message),
				success: z.literal(!isError)
			})
		}
	}
}));

const defaultAPIRouteZodOpenAPIConfig: APIRouteZodOpenAPIConfig = { responses: mapValues(statusCodeToResponseMessageMap, (message, code) => defineAPIRouteZodOpenAPIJsonResponseConfig(undefined, message, +code >= 400)) };
