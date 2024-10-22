export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defaultHonoFactory.createHandlers((ctx) => {
	if (ctx.admin) return ctx.json(createAPISuccessResponseData({ id: ctx.session.adminId, twoFactorAuthenticationStatus: ctx.admin.twoFactorAuthenticationStatus }));
	return ctx.json(createAPISuccessResponseData());
});
