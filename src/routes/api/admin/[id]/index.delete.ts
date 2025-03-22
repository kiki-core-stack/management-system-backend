import { mongooseConnections } from '@kiki-core-stack/pack/constants/mongoose';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import { AdminLogModel } from '@kiki-core-stack/pack/models/admin/log';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    await mongooseConnections.default!.transaction(async (session) => {
        await getModelDocumentByRouteIdAndDelete(ctx, AdminModel, { session }, async (admin) => {
            if (admin.id === ctx.adminId) throwApiError(409, '無法刪除自己！');
            if (await AdminModel.countDocuments() === 1) throwApiError(409, '無法刪除最後一位管理員！');
            await AdminLogModel.deleteMany({ admin }, { session });
            await AdminSessionModel.deleteMany({ admin }, { session });
        });
    });

    return ctx.createApiSuccessResponse();
});
