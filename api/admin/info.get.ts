export default defineEventHandler((event) => {
	if (!event.context.session.adminId) return createApiSuccessResponseData();
	return createApiSuccessResponseData({ id: event.context.session.adminId, twoFactorAuthenticationStatus: event.context.admin!.twoFactorAuthenticationStatus });
});
