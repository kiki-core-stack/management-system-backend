import type { Request } from '@kikiutils/hyper-express';
import redisController from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node/object';

declare global {
	const cleanupAdminCachesAndSession: (request: Request, admin: AdminDocument) => Promise<void>;
}

setReadonlyConstantToGlobalThis('cleanupAdminCachesAndSession', async (request: Request, admin: AdminDocument) => {
	await redisController.twoFactorAuthentication.emailOtpCode.del(admin);
	await redisController.twoFactorAuthentication.tempTotpSecret.del(admin);
	await request.session.clear();
});
