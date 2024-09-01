import redisController from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';

export const cleanupAdminCachesAndEventSession = async (event: H3RequestEvent, admin: AdminDocument) => {
	await redisController.twoFactorAuthentication.emailOtpCode.del(admin);
	await redisController.twoFactorAuthentication.tempTotpSecret.del(admin);
	clearH3EventContextSession(event);
};
