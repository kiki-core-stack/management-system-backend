export const handlerProperties = Object.freeze({ noLoginRequired: true });

export default defineApiRouteHandler((ctx) => {
	if (ctx.session.adminId) return createApiSuccessResponseData({ id: ctx.session.adminId, twoFactorAuthenticationStatus: ctx.admin!.twoFactorAuthenticationStatus });
});
