import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import configs from '@/configs';
import { zodOpenAPIRegistry } from '@/core/constants/zod-openapi';

export const routeHandlerOptions = defineRouteHandlerOptions({ environment: 'development' });

export default defineRouteHandler((_, response) => {
	const generator = new OpenApiGeneratorV31(zodOpenAPIRegistry.definitions);
	response.header('content-type', 'application/json').send(JSON.stringify(generator.generateDocument(configs.openAPI as any), null, 2));
});
