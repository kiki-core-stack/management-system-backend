import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import { argon2HashPassword } from '@kiki-core-stack/pack/libs/password-argon2';
import * as z from '@kiki-core-stack/pack/libs/zod';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';
import { AdminRoleModel } from '@kiki-core-stack/pack/models/admin/role';
import type { ZodValidatorType } from '@kiki-core-stack/pack/types';

import { defaultHonoFactory } from '@/core/constants/hono';

export const jsonSchema = z.object({
    account: z.string().trim().min(1).max(16),
    email: z.email().trim().toLowerCase().optional(),
    enabled: z.boolean(),
    password: z.string().trim().min(1).optional(),
    roles: z.array(z.objectId().refine((_id) => AdminRoleModel.exists({ _id }))),
}) satisfies ZodValidatorType<Admin, 'isSuperAdmin'>;

export const routePermission = 'admin admin.create';

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema.extend({ password: z.string().trim().min(1) })),
    async (ctx) => {
        const data = ctx.req.valid('json');
        return ctx.createApiSuccessResponse(
            await AdminModel.create({
                ...data,
                password: await argon2HashPassword(data.password),
            }),
        );
    },
);
