import redisController from '@kikiutils/el-plus-admin-pack/controllers/redis';
import type { AdminDocument } from '@kikiutils/el-plus-admin-pack/models';

export const cleanupAdminCachesAndEventSession = async (event: H3RequestEvent, admin: AdminDocument) => {
	await redisController.twoFactorAuthentication.emailOtpCode.del(admin);
	await redisController.twoFactorAuthentication.tempTotpSecret.del(admin);
	clearH3EventContextSession(event);
};
