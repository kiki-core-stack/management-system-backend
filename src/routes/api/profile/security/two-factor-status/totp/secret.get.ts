import { redisController } from '@kiki-core-stack/pack/controllers/redis';
import { generateTotpSecretData } from '@kiki-core-stack/pack/libs/otp';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    if (ctx.admin!.twoFactorAuthenticationStatus.totp) return ctx.createApiSuccessResponse();
    const totpSecretData = generateTotpSecretData('後台管理系統', ctx.admin!.account);
    await redisController.tempTotpSecret.set(totpSecretData.secret, ctx.admin!.id);
    return ctx.createApiSuccessResponse(totpSecretData);
});
