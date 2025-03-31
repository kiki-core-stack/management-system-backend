import { apiReference } from '@scalar/hono-api-reference';

import { defaultHonoFactory } from '@/core/constants/hono';

export default defaultHonoFactory.createHandlers(apiReference({ url: '/docs/openapi.json' }));
