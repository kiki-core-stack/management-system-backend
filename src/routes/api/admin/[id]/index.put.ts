import { mongooseConnections } from '@kiki-core-stack/pack/constants/mongoose';
import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import { assertMongooseUpdateSuccess } from '@kikiutils/mongoose/utils';
import type { UpdateQuery } from 'mongoose';

import { defaultHonoFactory } from '@/core/constants/hono';

import { jsonSchema } from '../index.post';

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx);
        const updateQuery: UpdateQuery<Admin> = ctx.req.valid('json');
        updateQuery.enabled = updateQuery.enabled || admin._id === ctx.adminId;
        if (!updateQuery.email) updateQuery.$unset = { email: true };
        return await mongooseConnections.default!.transaction(async (session) => {
            await assertMongooseUpdateSuccess(admin.updateOne(updateQuery, { session }));
            if (!updateQuery.enabled) await AdminSessionModel.deleteMany({ admin }, { session });
            return ctx.createApiSuccessResponse();
        });
    },
);
