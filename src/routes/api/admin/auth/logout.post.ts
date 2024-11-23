export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defaultHonoFactory.createHandlers(async (ctx) => {
    if (ctx.admin) await cleanupAdminCachesAndSession(ctx, ctx.admin);
    else ctx.clearSession();
    return ctx.createAPISuccessResponse();
});
