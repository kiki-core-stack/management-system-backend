import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import configs from '@/configs';
import { zodOpenAPIRegistry } from '@/core/constants/zod-openapi';

export const routeHandlerOptions = defineRouteHandlerOptions({ environment: 'development' });

export default defaultHonoFactory.createHandlers((ctx) => {
	const generator = new OpenApiGeneratorV31(zodOpenAPIRegistry.definitions);
	ctx.header('content-type', 'application/json');
	return ctx.body(JSON.stringify(generator.generateDocument(configs.openAPI as any), null, 2));
});
