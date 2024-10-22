import { redisController } from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { Context } from 'hono';

declare global {
	const cleanupAdminCachesAndSession: (ctx: Context, admin: AdminDocument) => Promise<void>;
}

setReadonlyConstantToGlobalThis('cleanupAdminCachesAndSession', async (ctx: Context, admin: AdminDocument) => {
	await redisController.twoFactorAuthentication.emailOTPCode.del(admin);
	await redisController.twoFactorAuthentication.tempTOTPSecret.del(admin);
	ctx.clearSession();
});
