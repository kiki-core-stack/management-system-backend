import redisController from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import { requireTwoFactorAuthentication } from '@kikiutils/kiki-core-stack-pack/hono-backend/utils/two-factor-authentication';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';
import type { UpdateQuery } from 'mongoose';

export default defineApiRouteHandler(async (ctx) => {
	const admin = ctx.admin!.$clone();
	if (!(admin.totpSecret = (await redisController.twoFactorAuthentication.tempTotpSecret.get(admin)) || admin.totpSecret)) throwApiError(500, '系統錯誤，請重整頁面後再試！');
	const isEnabled = admin.twoFactorAuthenticationStatus.totp;
	admin.twoFactorAuthenticationStatus.totp = true;
	await requireTwoFactorAuthentication(ctx, true, true, admin);
	const updateQuery: UpdateQuery<AdminDocument> = { 'twoFactorAuthenticationStatus.totp': !isEnabled };
	if (isEnabled) updateQuery.$unset = { totpSecret: true };
	else updateQuery.totpSecret = admin.totpSecret;
	await admin.updateOne(updateQuery);
	await redisController.twoFactorAuthentication.tempTotpSecret.del(admin);
});
