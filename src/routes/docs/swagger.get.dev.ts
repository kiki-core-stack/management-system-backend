import { swaggerUI } from '@hono/swagger-ui';

import { defaultHonoFactory } from '@/core/constants/hono';

export const routePermission = 'ignore';

export default defaultHonoFactory.createHandlers(swaggerUI({ url: '/docs/openapi.json' }));
