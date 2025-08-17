import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';
import { assertMongooseUpdateSuccess } from '@kikiutils/mongoose/utils';
import { isEqual } from 'lodash-es';

import { defaultHonoFactory } from '@/core/constants/hono';
import { assertNotModifiedAndStripData } from '@/libs';
import { clearAllAdminPermissionCache } from '@/libs/admin/permission';

import { jsonSchema } from '../index.post';

export const routePermission = 'admin.role.update';

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema.extend({ updatedAt: z.strictIsoDateString() })),
    async (ctx) => {
        const adminRole = await AdminRoleModel.findByRouteIdOrThrowNotFoundError(ctx);
        const data = assertNotModifiedAndStripData(ctx.req.valid('json'), adminRole);
        await assertMongooseUpdateSuccess(
            adminRole.updateOne({
                ...data,
                updatedByAdmin: ctx.adminId,
            }),
        );

        if (!isEqual(adminRole.permissions.toSorted(), data.permissions.toSorted())) {
            clearAllAdminPermissionCache().catch(() => {});
        }

        return ctx.createApiSuccessResponse();
    },
);
