export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defaultHonoFactory.createHandlers(async (ctx) => {
    return ctx.createApiSuccessResponse();
});
