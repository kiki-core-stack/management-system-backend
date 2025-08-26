import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import * as enhancedRedisStore from '@kiki-core-stack/pack/stores/enhanced/redis';

import { defaultHonoFactory } from '@/core/constants/hono';

const paramsSchema = z.object({ token: z.string().trim().min(1) });
export const routePermission = 'ignore';

export default defaultHonoFactory.createHandlers(
    apiZValidator('param', paramsSchema),
    async (ctx) => {
        const { token } = ctx.req.valid('param');
        const adminQrCodeLoginData = await enhancedRedisStore.adminQrCodeLoginData.getItem(token);
        if (adminQrCodeLoginData?.status !== 'pending') throwApiError(410);
        await enhancedRedisStore.adminQrCodeLoginData.setItemWithTtl(
            3,
            {
                ...adminQrCodeLoginData,
                adminId: ctx.adminId!.toHexString(),
                status: 'approved',
            },
            token,
        );

        return ctx.createApiSuccessResponse();
    },
);
