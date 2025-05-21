import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import type { AdminChangePasswordData } from '@kiki-core-stack/pack/types/data/admin';
import { mongooseConnections } from '@kikiutils/mongoose/constants';
import { assertMongooseUpdateSuccess } from '@kikiutils/mongoose/utils';

import { defaultHonoFactory } from '@/core/constants/hono';

const jsonSchema = z.object({
    newPassword: z.string().trim().length(128),
    oldPassword: z.string().trim().length(128),
}) satisfies ZodValidatorType<AdminChangePasswordData>;

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const admin = await ctx.getAdmin();
        const data = ctx.req.valid('json');
        if (!admin.verifyPassword(data.oldPassword)) throwApiError(400, '舊密碼不正確！');
        return await mongooseConnections.default!.transaction(async (session) => {
            await assertMongooseUpdateSuccess(admin.updateOne({ password: data.newPassword }, { session }));
            await AdminSessionModel.deleteMany({ a: admin }, { session });
            return ctx.createApiSuccessResponse();
        });
    },
);
