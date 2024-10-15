export const handlerProperties = Object.freeze({ noLoginRequired: true });

export default defineApiRouteHandler(async (ctx) => await cleanupAdminCachesAndEventSession(ctx, ctx.admin!));
