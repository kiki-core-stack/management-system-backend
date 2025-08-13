import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type {
    Admin,
    AdminDocument,
} from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import * as enhancedRedisStore from '@kiki-core-stack/pack/stores/enhanced/redis';
import { mongooseConnections } from '@kikiutils/mongoose/constants';
import { assertMongooseUpdateSuccess } from '@kikiutils/mongoose/utils';
import { isEqual } from 'lodash-es';
import type { UpdateQuery } from 'mongoose';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { assertNotModifiedAndStripData } from '@/libs';

import { jsonSchema } from '../index.post';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'admin.update' } });

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        let admin: AdminDocument | undefined;
        let updateQuery: UpdateQuery<Admin> = {};
        await mongooseConnections.default!.transaction(async (session) => {
            admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, undefined, undefined, { session });
            updateQuery = assertNotModifiedAndStripData(ctx.req.valid('json'), admin);
            updateQuery.enabled = updateQuery.enabled || admin._id.equals(ctx.adminId);
            if (!updateQuery.email) updateQuery.$unset = { email: true };
            await assertMongooseUpdateSuccess(admin.updateOne(updateQuery, { session }));
            if (!updateQuery.enabled) await AdminSessionModel.deleteMany({ admin }, { session });
        });

        if (admin && !isEqual(admin.roles.toSorted(), updateQuery.roles?.toSorted())) {
            enhancedRedisStore.adminPermission.removeItem(admin._id.toHexString()).catch(() => {});
        }

        return ctx.createApiSuccessResponse();
    },
);
