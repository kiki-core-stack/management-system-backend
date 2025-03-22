export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defaultHonoFactory.createHandlers((ctx) => {
    if (ctx.adminId) return ctx.createApiSuccessResponse({ id: ctx.adminId });
    return ctx.createApiSuccessResponse();
});
