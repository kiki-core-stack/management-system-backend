import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';

import { populateCreatedAndEditedByAdminOptions } from '@/constants/admin';
import { defaultHonoFactory } from '@/core/constants/hono';
import { paginateModelDataWithApiResponse } from '@/libs/response';

export const routePermission = 'admin admin.role.list';

export default defaultHonoFactory.createHandlers((ctx) => {
    return paginateModelDataWithApiResponse(
        ctx,
        AdminRoleModel,
        undefined,
        { populate: populateCreatedAndEditedByAdminOptions },
    );
});
