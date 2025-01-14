import { redisController } from '@kiki-core-stack/pack/controllers/redis';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import type { UpdateQuery } from 'mongoose';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    const totpSecret = await redisController.tempTOTPSecret.get(ctx.admin!.id) || ctx.admin!.totpSecret;
    if (!totpSecret) throwAPIError(500, '系統錯誤，請重整頁面後再試！');
    await requireEmailOTPTwoFactorAuthentication(ctx, ctx.admin!, 'adminToggleTwoFactorAuthenticationStatus');
    await requireTOTPTwoFactorAuthentication(ctx, ctx.admin!, true, totpSecret);
    const updateQuery: UpdateQuery<AdminDocument> = { 'twoFactorAuthenticationStatus.totp': !ctx.admin!.twoFactorAuthenticationStatus.totp };
    if (!updateQuery['twoFactorAuthenticationStatus.totp']) updateQuery.$unset = { totpSecret: true };
    else updateQuery.totpSecret = totpSecret;
    await ctx.admin!.updateOne(updateQuery);
    await redisController.tempTOTPSecret.del(ctx.admin!.id);
    return ctx.createAPISuccessResponse();
});
