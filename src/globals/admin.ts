import type { Request, Response } from '@kikiutils/hyper-express';
import redisController from '@kikiutils/kiki-core-stack-pack/controllers/redis';
import type { AdminDocument } from '@kikiutils/kiki-core-stack-pack/models';

declare global {
	const cleanupAdminCachesAndSession: (request: Request, response: Response, admin: AdminDocument) => Promise<void>;
}

Object.defineProperty(globalThis, 'cleanupAdminCachesAndSession', {
	configurable: false,
	async value(request: Request, response: Response, admin: AdminDocument) {
		await redisController.twoFactorAuthentication.emailOtpCode.del(admin);
		await redisController.twoFactorAuthentication.tempTotpSecret.del(admin);
		await clearRequestLocalsSession(request, response);
	},
	writable: false
});
