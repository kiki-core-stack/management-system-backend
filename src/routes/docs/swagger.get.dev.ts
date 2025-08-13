import { swaggerUI } from '@hono/swagger-ui';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'ignore' } });

export default defaultHonoFactory.createHandlers(swaggerUI({ url: '/docs/openapi.json' }));
