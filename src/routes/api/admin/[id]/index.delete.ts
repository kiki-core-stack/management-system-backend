import { mongooseConnections } from '@kiki-core-stack/pack/constants/mongoose';
import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import { AdminLogModel } from '@kiki-core-stack/pack/models/admin/log';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';

import { defaultHonoFactory } from '@/core/constants/hono';
import { getModelDocumentByRouteIdAndDelete } from '@/libs/model';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    return await mongooseConnections.default!.transaction(async (session) => {
        await getModelDocumentByRouteIdAndDelete(
            ctx,
            AdminModel,
            undefined,
            { session },
            async (admin) => {
                if (admin._id === ctx.adminId) throwApiError(409, '無法刪除自己！');
                if (await AdminModel.countDocuments() === 1) throwApiError(409, '無法刪除最後一位管理員！');
                await AdminLogModel.deleteMany({ a: admin }, { session });
                await AdminSessionModel.deleteMany({ a: admin }, { session });
            },
        );

        return ctx.createApiSuccessResponse();
    });
});
