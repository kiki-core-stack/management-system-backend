import { requireTwoFactorAuthentication } from '@kikiutils/kiki-core-stack-pack/hono-backend/utils/two-factor-authentication';

export default defineApiRouteHandler(async (ctx) => {
	const admin = ctx.admin!.$clone();
	const isEnabled = admin.twoFactorAuthenticationStatus.emailOtp;
	admin.twoFactorAuthenticationStatus.emailOtp = true;
	await requireTwoFactorAuthentication(ctx, true, true, admin);
	await admin.updateOne({ 'twoFactorAuthenticationStatus.emailOtp': !isEnabled });
});
