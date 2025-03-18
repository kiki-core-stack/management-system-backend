import { redisController } from '@kiki-core-stack/pack/controllers/redis';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import type { UpdateQuery } from 'mongoose';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    const totpSecret = await redisController.tempTotpSecret.get(ctx.admin!.id) || ctx.admin!.totpSecret;
    if (!totpSecret) throwApiError(500, '系統錯誤，請重整頁面後再試！');
    await requireEmailOtpTwoFactorAuthentication(ctx, ctx.admin!, 'adminToggleTwoFactorAuthenticationStatus');
    await requireTotpTwoFactorAuthentication(ctx, ctx.admin!, true, totpSecret);
    // eslint-disable-next-line style/max-len
    const updateQuery: UpdateQuery<AdminDocument> = { 'twoFactorAuthenticationStatus.totp': !ctx.admin!.twoFactorAuthenticationStatus.totp };
    if (!updateQuery['twoFactorAuthenticationStatus.totp']) updateQuery.$unset = { totpSecret: true };
    else updateQuery.totpSecret = totpSecret;
    await ctx.admin!.updateOne(updateQuery);
    await redisController.tempTotpSecret.del(ctx.admin!.id);
    return ctx.createApiSuccessResponse();
});
