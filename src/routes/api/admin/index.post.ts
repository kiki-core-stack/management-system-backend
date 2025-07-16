import { apiZValidator } from '@kiki-core-stack/pack/hono-backend/libs/api/zod-validator';
import * as z from '@kiki-core-stack/pack/libs/zod';
import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { Admin } from '@kiki-core-stack/pack/models/admin';

import { defaultHonoFactory } from '@/core/constants/hono';

export const jsonSchema = z.object({
    account: z.string().trim().min(1).max(16),
    email: z.email().trim().toLowerCase().optional(),
    enabled: z.boolean(),
    password: z.string().trim().length(128).optional(),
}) satisfies ZodValidatorType<Admin>;

export default defaultHonoFactory.createHandlers(
    apiZValidator('json', jsonSchema),
    async (ctx) => ctx.createApiSuccessResponse(await AdminModel.create(ctx.req.valid('json'))),
);
