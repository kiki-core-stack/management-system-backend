import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';
import { createMiddleware } from 'hono/factory';

export default createMiddleware(async (ctx, next) => {
	if (ctx.session.adminId) {
		ctx.admin = await AdminModel.findById(ctx.session.adminId);
		if (!ctx.admin?.enabled) delete ctx.session.adminId;
	}

	if (!ctx.session.adminId) {
		const latestRouteHandler = ctx.req.matchedRoutes.at(-1)?.handler as RouteHandler | undefined;
		if (latestRouteHandler?.isRouteHandler && !latestRouteHandler.noLoginRequired) throwApiError(401);
	}

	await next();
});
