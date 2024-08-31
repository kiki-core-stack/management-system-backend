export default defineEventHandler(async (event) => {
	const admin = event.context.admin!.$clone();
	const isEnabled = admin.twoFactorAuthenticationStatus.emailOtp;
	admin.twoFactorAuthenticationStatus.emailOtp = true;
	await requireTwoFactorAuthentication(event, true, true, admin);
	await admin.updateOne({ 'twoFactorAuthenticationStatus.emailOtp': !isEnabled });
	return createApiSuccessResponseData();
});
