import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import { mongooseConnections } from '@kikiutils/mongoose/constants';
import { assertMongooseUpdateSuccess } from '@kikiutils/mongoose/utils';
import type { UpdateQuery } from 'mongoose';

import { defaultHonoFactory } from '@/core/constants/hono';

import { jsonSchema } from '../index.post';

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx);
        const { updatedAt, ...data } = ctx.req.valid('json');
        if (updatedAt !== admin.updatedAt.toISOString()) throwApiError(409, '該資料已被修改！請重新整理。');
        const updateQuery: UpdateQuery<Admin> = data;
        updateQuery.enabled = updateQuery.enabled || admin._id.equals(ctx.adminId);
        if (!updateQuery.email) updateQuery.$unset = { email: true };
        return await mongooseConnections.default!.transaction(async (session) => {
            await assertMongooseUpdateSuccess(admin.updateOne(updateQuery, { session }));
            if (!updateQuery.enabled) await AdminSessionModel.deleteMany({ admin }, { session });
            return ctx.createApiSuccessResponse();
        });
    },
);
