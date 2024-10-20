import { apiReference } from '@scalar/express-api-reference';

export const routeHandlerOptions = defineRouteHandlerOptions({ environment: 'development' });

export default defineRouteHandler(apiReference({ spec: { url: '/docs/openapi.json' } }));
