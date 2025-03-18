import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { H } from 'hono/types';

import { honoApp } from '@/core/app';
import type { RouteHandlerProperties } from '@/core/types/route';

honoApp.use('/api/*', async (ctx, next) => {
    // eslint-disable-next-line style/max-len
    const routeHandler = ctx.req.matchedRoutes[ctx.req.matchedRoutes.length - 1]?.handler as Undefinedable<H & RouteHandlerProperties>;
    if (!routeHandler?.isHandler) return await next();
    if (ctx.session.adminId) {
        ctx.admin = await AdminModel.findById(ctx.session.adminId);
        if (!ctx.admin?.enabled) delete ctx.session.adminId;
    }

    if (routeHandler.noLoginRequired || ctx.session.adminId) return await next();
    throwApiError(401);
});
