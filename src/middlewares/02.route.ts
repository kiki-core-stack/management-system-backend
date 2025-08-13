import { matchedRoutes } from 'hono/route';
import type { H } from 'hono/types';

import { honoApp } from '@/core/app';
import type { RouteHandlerProperties } from '@/core/types/route';

honoApp.use('/api/*', (ctx, next) => {
    const routerRoutes = matchedRoutes(ctx);
    ctx.routeHandler = routerRoutes[routerRoutes.length - 1]?.handler as (H & RouteHandlerProperties) | undefined;
    return next();
});
