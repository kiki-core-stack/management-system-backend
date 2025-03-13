import { apiReference } from '@scalar/hono-api-reference';

export default defaultHonoFactory.createHandlers(apiReference({ url: '/docs/openapi.json' }));
