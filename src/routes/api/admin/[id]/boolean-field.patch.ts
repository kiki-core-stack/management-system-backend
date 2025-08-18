import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import { mongooseConnections } from '@kikiutils/mongoose/constants';
import type {
    FilterQuery,
    Types,
} from 'mongoose';

import { defaultHonoFactory } from '@/core/constants/hono';
import { getAdminPermission } from '@/libs/admin/permission';
import { getModelDocumentByRouteIdAndUpdateBooleanField } from '@/libs/model';

export const routePermission = 'admin.toggle';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    const filter: FilterQuery<Admin> = {};
    if (!(await getAdminPermission(ctx.adminId!)).isSuperAdmin) filter.isSuperAdmin = false;
    return mongooseConnections.default!.transaction(async (session) => {
        await getModelDocumentByRouteIdAndUpdateBooleanField(
            ctx,
            AdminModel,
            ['enabled'],
            filter,
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
