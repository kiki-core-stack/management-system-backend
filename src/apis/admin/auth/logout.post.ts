export default defineApiRouteHandler(async (ctx) => await cleanupAdminCachesAndEventSession(ctx, ctx.admin!));
