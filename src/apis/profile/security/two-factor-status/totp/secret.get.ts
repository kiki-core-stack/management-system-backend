import redisController from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import { generateTotpSecretData } from '@kikiutils/kiki-core-stack-pack/utils/two-factor-authentication';

export default defineApiRouteHandler(async (ctx) => {
	if (ctx.admin!.twoFactorAuthenticationStatus.totp) return createApiSuccessResponseData();
	const totpSecretData = generateTotpSecretData('後台管理系統', ctx.admin!.account);
	await redisController.twoFactorAuthentication.tempTotpSecret.set(ctx.admin!, totpSecretData.secret);
	return createApiSuccessResponseData(totpSecretData);
});
