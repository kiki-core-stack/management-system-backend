import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import * as enhancedRedisStore from '@kiki-core-stack/pack/stores/enhanced/redis';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { handleAdminLogin } from '@/libs/admin/auth';

const jsonSchema = z.object({ token: z.string().trim().min(1) });
export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const { token } = ctx.req.valid('json');
        const abortSignal = ctx.req.raw.signal;
        const pollingStartAt = Date.now();
        while (Date.now() - pollingStartAt < 20000) {
            if (abortSignal.aborted) return ctx.createApiSuccessResponse();
            const adminQrCodeLoginData = await enhancedRedisStore.adminQrCodeLoginData.getItem(token);
            if (!adminQrCodeLoginData) throwApiError(410);
            if (adminQrCodeLoginData.adminId) {
                const admin = await AdminModel.findOne({
                    _id: adminQrCodeLoginData.adminId,
                    enabled: true,
                });

                if (!admin) throwApiError(410);
                await handleAdminLogin(ctx, admin.id, undefined, 'QR Code 登入');
                enhancedRedisStore.adminQrCodeLoginData.removeItem(token).catch(() => {});
                return ctx.createApiSuccessResponse({ status: 'success' });
            }

            await Bun.sleep(500);
        }

        return ctx.createApiSuccessResponse({ status: 'pending' });
    },
);
