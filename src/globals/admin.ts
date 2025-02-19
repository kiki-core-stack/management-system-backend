import { redisController } from '@kiki-core-stack/pack/controllers/redis';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import type { Context } from 'hono';

declare global {
    const populateCreatedAndEditedByAdminOptions: typeof _populateCreatedAndEditedByAdminOptions;

    const cleanupAdminCachesAndSession: (ctx: Context, admin: AdminDocument) => Promise<void>;
}

const _populateCreatedAndEditedByAdminOptions = [
    {
        path: 'createdByAdmin',
        select: [
            '-_id',
            'account',
        ],
    },
    {
        path: 'editedByAdmin',
        select: [
            '-_id',
            'account',
        ],
    },
];

setReadonlyConstantToGlobalThis<typeof populateCreatedAndEditedByAdminOptions>('populateCreatedAndEditedByAdminOptions', _populateCreatedAndEditedByAdminOptions);
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
