import { swaggerUI } from '@hono/swagger-ui';

import { defaultHonoFactory } from '@/core/constants/hono';

export default defaultHonoFactory.createHandlers(swaggerUI({ url: '/docs/openapi.json' }));
