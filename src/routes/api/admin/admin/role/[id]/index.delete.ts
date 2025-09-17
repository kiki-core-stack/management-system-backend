import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';

import { defaultHonoFactory } from '@/core/constants/hono';
import { getModelDocumentByRouteIdAndDelete } from '@/libs/model';

export const routePermission = {
    key: 'admin.role.delete',
    type: 'admin',
};

export default defaultHonoFactory.createHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndDelete(
        ctx,
        AdminRoleModel,
        undefined,
        undefined,
        async (adminRole) => {
            if (await AdminModel.exists({ roles: adminRole })) throwApiError(409);
        },
    );

    return ctx.createApiSuccessResponse();
});
