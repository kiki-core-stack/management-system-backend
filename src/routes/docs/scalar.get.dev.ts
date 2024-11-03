import { apiReference } from '@scalar/hono-api-reference';

export default defaultHonoFactory.createHandlers(apiReference({ spec: { url: '/docs/openapi.json' } }));
