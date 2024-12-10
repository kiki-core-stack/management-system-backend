import { mongooseConnections } from '@kiki-core-stack/pack/constants/mongoose';
import { AdminLogModel, AdminModel } from '@kiki-core-stack/pack/models/admin';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    await mongooseConnections.default!.transaction(async (session) => {
        await getModelDocumentByRouteIdAndDelete(ctx, AdminModel, { session }, async (admin) => {
            if (admin.id === ctx.session.adminId) throwAPIError(409, '無法刪除自己！');
            if (await AdminModel.countDocuments() === 1) throwAPIError(409, '無法刪除最後一位管理員！');
            await AdminLogModel.deleteMany({ admin }, { session });
        });
    });

    return ctx.createAPISuccessResponse();
});
