export default defineRouteHandler(async (request, response) => {
	const admin = request.locals.admin!.$clone();
	const isEnabled = admin.twoFactorAuthenticationStatus.emailOtp;
	admin.twoFactorAuthenticationStatus.emailOtp = true;
	await requireTwoFactorAuthentication(request, true, true, admin);
	await admin.updateOne({ 'twoFactorAuthenticationStatus.emailOtp': !isEnabled });
	sendApiSuccessResponse(response);
});
