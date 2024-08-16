export default defineEventHandler((event) => {
	if (!event.context.session.adminId) return createResponseData();
	return createResponseData({ id: event.context.session.adminId, twoFactorAuthenticationStatus: event.context.admin!.twoFactorAuthenticationStatus });
});
