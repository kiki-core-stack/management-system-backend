import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';
import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';

import { defaultHonoFactory } from '@/core/constants/hono';

export const jsonSchema = z.object({
    account: z.string().trim().min(1).max(16),
    email: z.email().trim().toLowerCase().optional(),
    enabled: z.boolean(),
    password: z.string().trim().length(128).optional(),
    roles: z.array(z.objectId().refine(async (id) => await AdminRoleModel.exists({ _id: id }) !== null)),
}) satisfies ZodValidatorType<Admin, 'isSuperAdmin'>;

export const routePermission = {
    key: 'admin.create',
    type: 'admin',
};

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => ctx.createApiSuccessResponse(await AdminModel.create(ctx.req.valid('json'))),
);
