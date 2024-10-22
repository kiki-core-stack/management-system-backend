import { redisController } from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import { generateTOTPSecretData } from '@kikiutils/kiki-core-stack-pack/utils/two-factor-authentication';

export default defaultHonoFactory.createHandlers(async (ctx) => {
	if (ctx.admin!.twoFactorAuthenticationStatus.totp) return ctx.json(createAPISuccessResponseData());
	const totpSecretData = generateTOTPSecretData('後台管理系統', ctx.admin!.account);
	await redisController.twoFactorAuthentication.tempTOTPSecret.set(ctx.admin!, totpSecretData.secret);
	return ctx.json(createAPISuccessResponseData(totpSecretData));
});
