import { redisController } from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import { generateTotpSecretData } from '@kikiutils/kiki-core-stack-pack/utils/two-factor-authentication';

export default defineRouteHandler(async (request, response) => {
	if (request.locals.admin!.twoFactorAuthenticationStatus.totp) return sendApiSuccessResponse(response);
	const totpSecretData = generateTotpSecretData('後台管理系統', request.locals.admin!.account);
	await redisController.twoFactorAuthentication.tempTotpSecret.set(request.locals.admin!, totpSecretData.secret);
	sendApiSuccessResponse(response, totpSecretData);
});
