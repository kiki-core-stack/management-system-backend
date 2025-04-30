import { Scalar } from '@scalar/hono-api-reference';

import { defaultHonoFactory } from '@/core/constants/hono';

export default defaultHonoFactory.createHandlers(Scalar({ url: '/docs/openapi.json' }));
