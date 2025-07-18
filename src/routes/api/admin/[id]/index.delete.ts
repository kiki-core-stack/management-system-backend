import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import { mongooseConnections } from '@kikiutils/mongoose/constants';
import type { Types } from 'mongoose';

import { defaultHonoFactory } from '@/core/constants/hono';
import { getModelDocumentByRouteIdAndDelete } from '@/libs/model';

export default defaultHonoFactory.createHandlers((ctx) => {
    return mongooseConnections.default!.transaction(async (session) => {
        await getModelDocumentByRouteIdAndDelete(
            ctx,
            AdminModel,
            undefined,
            { session },
            async (admin) => {
                // TODO 解決unknown
                if ((admin._id as Types.ObjectId).equals(ctx.adminId)) throwApiError(409, '無法刪除自己');
                if (await AdminModel.countDocuments() === 1) throwApiError(409, '無法刪除最後一位管理員');
                await AdminSessionModel.deleteMany({ admin }, { session });
            },
        );

        return ctx.createApiSuccessResponse();
    });
});
