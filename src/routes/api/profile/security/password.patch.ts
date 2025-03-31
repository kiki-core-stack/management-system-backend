import { mongooseConnections } from '@kiki-core-stack/pack/constants/mongoose';
import { z } from '@kiki-core-stack/pack/constants/zod';
import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import type { ProfileSecurityChangePasswordFormData } from '@kiki-core-stack/pack/types/data/profile';
import { assertMongooseUpdateSuccess } from '@kikiutils/mongoose/utils';

import { defaultHonoFactory } from '@/core/constants/hono';
import { apiZValidator } from '@/libs/zod-validator';

export default defaultHonoFactory.createHandlers(
    apiZValidator(
        'json',
        z.object({
            conformPassword: z.string().trim().length(128),
            newPassword: z.string().trim().length(128),
            oldPassword: z.string().trim().length(128),
        }) satisfies ZodValidatorType<ProfileSecurityChangePasswordFormData>,
    ),
    async (ctx) => {
        const admin = await ctx.getAdmin();
        const data = ctx.req.valid('json');
        if (data.newPassword !== data.conformPassword) throwApiError(400, '確認密碼不符！');
        if (!admin.verifyPassword(data.oldPassword)) throwApiError(400, '舊密碼不正確！');
        if (data.newPassword === data.oldPassword) throwApiError(400, '新密碼不能與舊密碼相同！');
        return await mongooseConnections.default!.transaction(async (session) => {
            await assertMongooseUpdateSuccess(admin.updateOne({ password: data.newPassword }, { session }));
            await AdminSessionModel.deleteMany({ a: admin }, { session });
            return ctx.createApiSuccessResponse();
        });
    },
);
