import type { Request, Response } from '@kikiutils/hyper-express';
import redisController from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';

declare global {
	function cleanupAdminCachesAndSession(request: Request, response: Response, admin: AdminDocument): Promise<void>;
}

globalThis.cleanupAdminCachesAndSession = async (request, response, admin) => {
	await redisController.twoFactorAuthentication.emailOtpCode.del(admin);
	await redisController.twoFactorAuthentication.tempTotpSecret.del(admin);
	await clearRequestLocalsSession(request, response);
	sendApiSuccessResponse(response);
};
