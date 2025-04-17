import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { AdminLoginFormData } from '@kiki-core-stack/pack/types/data/admin';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { handleAdminLogin } from '@/libs/admin';

const jsonSchema = z.object({
    account: z.string().trim().min(1),
    password: z.string().trim().min(1),
    verCode: z.string().trim().min(1).toLowerCase(),
}) satisfies ZodValidatorType<AdminLoginFormData>;

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const data = ctx.req.valid('json');
        if (data.verCode !== ctx.popSession('verCode')?.toLowerCase()) {
            throwApiError(400, '驗證碼不正確！', 'invalidVerificationCode');
        }

        const admin = await AdminModel.findOne({
            account: data.account,
            enabled: true,
        });

        if (!admin?.enabled || !admin.verifyPassword(data.password)) throwApiError(404, '帳號不存在，未啟用或密碼不正確！');
        await handleAdminLogin(ctx, admin.id);
        return ctx.createApiSuccessResponse();
    },
);
