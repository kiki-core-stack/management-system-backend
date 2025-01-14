import { redisController } from '@kiki-core-stack/pack/controllers/redis';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { Context } from 'hono';

declare global {
    const cleanupAdminCachesAndSession: (ctx: Context, admin: AdminDocument) => Promise<void>;
}

setReadonlyConstantToGlobalThis<typeof cleanupAdminCachesAndSession>('cleanupAdminCachesAndSession', async (ctx, admin) => {
    const promises = [redisController.tempTOTPSecret.del(admin.id)];
    if (admin.email) {
        promises.push(...[
            redisController.emailOTPCode.del('adminChangePassword', admin.email, admin.id),
            redisController.emailOTPCode.del('adminLogin', admin.email, admin.id),
            redisController.emailOTPCode.del('adminToggleTwoFactorAuthenticationStatus', admin.email, admin.id),
        ]);
    }

    await Promise.all(promises);
    ctx.clearSession();
});
