import { apiReference } from '@scalar/hono-api-reference';

export const routeHandlerOptions = defineRouteHandlerOptions({ environment: 'development' });

export default defaultHonoFactory.createHandlers(apiReference({ spec: { url: '/docs/openapi.json' } }));
