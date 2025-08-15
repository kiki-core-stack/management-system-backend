import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import * as enhancedRedisStore from '@kiki-core-stack/pack/stores/enhanced/redis';
import { mongooseConnections } from '@kikiutils/mongoose/constants';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'admin.delete' } });

export default defaultHonoFactory.createHandlers(async (ctx) => {
    let admin: AdminDocument | undefined;
    await mongooseConnections.default!.transaction(async (session) => {
        admin = await AdminModel.findByRouteIdOrThrowNotFoundError(ctx, undefined, undefined, { session });
        if (admin._id.equals(ctx.adminId)) throwApiError(409, '無法刪除自己');
        if (await AdminModel.countDocuments(undefined, { session }) === 1) throwApiError(409, '無法刪除最後一位管理員');
        await AdminSessionModel.deleteMany({ admin }, { session });
        await admin.deleteOne({ session });
    });

    if (admin) enhancedRedisStore.adminPermission.removeItem(admin._id.toHexString()).catch(() => {});
    return ctx.createApiSuccessResponse();
});
