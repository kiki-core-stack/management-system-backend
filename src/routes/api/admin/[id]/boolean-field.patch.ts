import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import { mongooseConnections } from '@kikiutils/mongoose/constants';
import type { Types } from 'mongoose';

import { defaultHonoFactory } from '@/core/constants/hono';
import { getModelDocumentByRouteIdAndUpdateBooleanField } from '@/libs/model';

export const routePermission = 'admin.toggle';

export default defaultHonoFactory.createHandlers((ctx) => {
    return mongooseConnections.default!.transaction(async (session) => {
        await getModelDocumentByRouteIdAndUpdateBooleanField(
            ctx,
            AdminModel,
            ['enabled'],
            undefined,
            { session },
            async (admin, field) => {
                if (field === 'enabled') {
                    // TODO 解決unknown
                    if ((admin._id as Types.ObjectId).equals(ctx.adminId)) throwApiError(400, '無法變更自己的啟用狀態');
                    await AdminSessionModel.deleteMany({ admin }, { session });
                }
            },
        );

        return ctx.createApiSuccessResponse();
    });
});
