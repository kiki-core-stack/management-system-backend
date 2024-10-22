import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';
import type { H } from 'hono/types';

import type { RouteHandlerProperties } from '@/core/types/route';

export default defaultHonoFactory.createMiddleware(async (ctx, next) => {
	const routeHandler = ctx.req.matchedRoutes[ctx.req.matchedRoutes.length - 1]?.handler as UndefinedAble<H & RouteHandlerProperties>;
	if (!routeHandler?.isHandler) return await next();
	if (ctx.session.adminId) {
		ctx.admin = await AdminModel.findById(ctx.session.adminId);
		if (!ctx.admin?.enabled) delete ctx.session.adminId;
	}

	if (routeHandler?.noLoginRequired || ctx.session.adminId) return await next();
	throwAPIError(401);
});
