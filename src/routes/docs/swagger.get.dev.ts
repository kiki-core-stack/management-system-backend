import { swaggerUI } from '@hono/swagger-ui';

export default defaultHonoFactory.createHandlers(swaggerUI({ url: '/docs/openapi.json' }));
