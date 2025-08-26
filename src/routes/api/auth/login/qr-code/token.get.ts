import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import * as enhancedRedisStore from '@kiki-core-stack/pack/stores/enhanced/redis';
import { generateWithNestedRandomLength } from '@kikiutils/shared/random';
import { nanoid } from 'nanoid';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { getClientIpFromXForwardedFor } from '@/core/utils/request';

const querySchema = z.object({ oldToken: z.string().trim().min(1).optional() });
export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });
export const routePermission = 'ignore';

export default defaultHonoFactory.createHandlers(
    apiZValidator('query', querySchema),
    async (ctx) => {
        const { oldToken } = ctx.req.valid('query');
        if (oldToken) await enhancedRedisStore.adminQrCodeLoginData.removeItem(oldToken);
        const token = generateWithNestedRandomLength(nanoid, 96, 128, 160, 192);
        await enhancedRedisStore.adminQrCodeLoginData.setItemWithTtl(
            60,
            {
                ip: getClientIpFromXForwardedFor(ctx)!,
                status: 'pending',
                userAgent: ctx.req.header('user-agent'),
            },
            token,
        );

        return ctx.createApiSuccessResponse({ token });
    },
);
