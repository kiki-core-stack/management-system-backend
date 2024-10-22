import { swaggerUI } from '@hono/swagger-ui';

export const routeHandlerOptions = defineRouteHandlerOptions({ environment: 'development' });

export default defaultHonoFactory.createHandlers(swaggerUI({ url: '/docs/openapi.json' }));
