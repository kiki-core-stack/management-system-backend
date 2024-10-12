import redisController from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';
import type { Context } from 'hono';

declare global {
	function cleanupAdminCachesAndEventSession(ctx: Context, admin: AdminDocument): Promise<void>;
}

globalThis.cleanupAdminCachesAndEventSession = async (ctx, admin) => {
	await redisController.twoFactorAuthentication.emailOtpCode.del(admin);
	await redisController.twoFactorAuthentication.tempTotpSecret.del(admin);
	clearHonoContextSession(ctx);
};
