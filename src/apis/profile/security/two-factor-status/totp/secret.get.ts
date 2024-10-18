import { redisController } from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import { generateTOTPSecretData } from '@kikiutils/kiki-core-stack-pack/utils/two-factor-authentication';

export default defineRouteHandler(async (request, response) => {
	if (request.locals.admin!.twoFactorAuthenticationStatus.totp) return sendAPISuccessResponse(response);
	const totpSecretData = generateTOTPSecretData('後台管理系統', request.locals.admin!.account);
	await redisController.twoFactorAuthentication.tempTOTPSecret.set(request.locals.admin!, totpSecretData.secret);
	sendAPISuccessResponse(response, totpSecretData);
});
