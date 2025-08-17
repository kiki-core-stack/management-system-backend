import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import type { AdminRole } from '@kiki-core-stack/pack/models/admin/role';
import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';

import { allAdminPermissions } from '@/constants/admin';
import { defaultHonoFactory } from '@/core/constants/hono';
import { micromatch } from '@/utils/micromatch';

export const jsonSchema = z.object({
    name: z.string().trim().min(1).max(16),
    permissions: z
        .array(z.string().trim())
        .refine((permissions) => {
            const allPermissions = [...allAdminPermissions];
            for (const permission of permissions) if (!micromatch.some(allPermissions, permission)) return false;
            return true;
        }),
}) satisfies ZodValidatorType<AdminRole>;

export const routePermission = 'admin.role.create';

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => {
        return ctx.createApiSuccessResponse(
            await AdminRoleModel.create({
                ...ctx.req.valid('json'),
                createdByAdmin: ctx.adminId,
            }),
        );
    },
);
