export default defineRouteHandler(async (request, response) => {
	const admin = request.locals.admin!.$clone();
	const isEnabled = admin.twoFactorAuthenticationStatus.emailOTP;
	admin.twoFactorAuthenticationStatus.emailOTP = true;
	await requireTwoFactorAuthentication(request, true, true, admin);
	await admin.updateOne({ 'twoFactorAuthenticationStatus.emailOTP': !isEnabled });
	sendAPISuccessResponse(response);
});
