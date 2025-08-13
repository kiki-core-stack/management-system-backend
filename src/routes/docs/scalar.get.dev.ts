import { Scalar } from '@scalar/hono-api-reference';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'ignore' } });

export default defaultHonoFactory.createHandlers(Scalar({ url: '/docs/openapi.json' }));
