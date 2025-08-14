import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';

import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';
import { paginateModelDataWithApiResponse } from '@/libs/response';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'admin.role.list' } });

export default defaultHonoFactory.createHandlers((ctx) => paginateModelDataWithApiResponse(ctx, AdminRoleModel));
