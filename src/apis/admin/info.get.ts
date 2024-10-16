export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defineRouteHandler((request, response) => {
	if (request.locals.session.adminId) return sendApiSuccessResponse(response, { id: request.locals.session.adminId, twoFactorAuthenticationStatus: request.locals.admin!.twoFactorAuthenticationStatus });
});
