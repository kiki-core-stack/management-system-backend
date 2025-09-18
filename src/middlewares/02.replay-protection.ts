import { createReplayProtectionMiddleware } from '@kiki-core-stack/pack/hono-backend/middlewares/replay-protection';

import { honoApp } from '@/core/app';

honoApp.use(
    '/api/*',
    createReplayProtectionMiddleware((ctx) => !!ctx.routeHandler?.isHandler),
);
