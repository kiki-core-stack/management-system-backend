import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import * as enhancedRedisStore from '@kiki-core-stack/pack/stores/enhanced/redis';
import { pick } from 'lodash-es';

import { defaultHonoFactory } from '@/core/constants/hono';

const paramsSchema = z.object({ token: z.string().trim().min(1) });
export const routePermission = 'ignore';

export default defaultHonoFactory.createHandlers(
    apiZValidator('param', paramsSchema),
    async (ctx) => {
        const adminQrCodeLoginData = await enhancedRedisStore.adminQrCodeLoginData.getItem(
            ctx.req.valid('param').token,
        );

        if (adminQrCodeLoginData?.status !== 'pending') throwApiError(410);
        return ctx.createApiSuccessResponse(pick(adminQrCodeLoginData, 'ip', 'userAgent'));
    },
);
