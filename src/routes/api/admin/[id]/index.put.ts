import { mongooseConnections } from '@kiki-core-stack/pack/constants/mongoose';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import type { UpdateQuery } from 'mongoose';

import { jsonSchema } from '../index.post';

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        const admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx);
        const updateQuery: UpdateQuery<AdminDocument> = ctx.req.valid('json');
        updateQuery.enabled = updateQuery.enabled || admin.id === ctx.adminId;
        if (!updateQuery.email) updateQuery.$unset = { email: true };
        return await mongooseConnections.default!.transaction(async (session) => {
            await admin.updateOne(updateQuery, { session });
            if (!updateQuery.enabled) await AdminSessionModel.deleteMany({ admin }, { session });
            return ctx.createApiSuccessResponse();
        });
    },
);
