import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';

import { defaultHonoFactory } from '@/core/constants/hono';
import { paginateModelDataWithApiResponse } from '@/libs/response';

export const routePermission = {
    key: 'admin.role.list',
    type: 'admin',
};

export default defaultHonoFactory.createHandlers((ctx) => paginateModelDataWithApiResponse(ctx, AdminRoleModel));
