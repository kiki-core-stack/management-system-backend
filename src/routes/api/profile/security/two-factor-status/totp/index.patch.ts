import { redisController } from '@kiki-core-stack/pack/controllers/redis';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import type { UpdateQuery } from 'mongoose';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    const admin = ctx.admin!.$clone();
    admin.totpSecret = await redisController.twoFactorAuthentication.tempTOTPSecret.get(admin) || admin.totpSecret;
    if (!admin.totpSecret) throwAPIError(500, '系統錯誤，請重整頁面後再試！');
    const isEnabled = admin.twoFactorAuthenticationStatus.totp;
    admin.twoFactorAuthenticationStatus.totp = true;
    await requireTwoFactorAuthentication(ctx, true, true, admin);
    const updateQuery: UpdateQuery<AdminDocument> = { 'twoFactorAuthenticationStatus.totp': !isEnabled };
    if (isEnabled) updateQuery.$unset = { totpSecret: true };
    else updateQuery.totpSecret = admin.totpSecret;
    await admin.updateOne(updateQuery);
    await redisController.twoFactorAuthentication.tempTOTPSecret.del(admin);
    return ctx.createAPISuccessResponse();
});
