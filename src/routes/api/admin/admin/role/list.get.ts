import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';

import { defaultHonoFactory } from '@/core/constants/hono';
import { paginateModelDataWithApiResponse } from '@/libs/response';

export const routePermission = 'admin admin.role.list';

export default defaultHonoFactory.createHandlers((ctx) => paginateModelDataWithApiResponse(ctx, AdminRoleModel));
