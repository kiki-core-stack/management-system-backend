import { throwApiError } from '@kiki-core-stack/pack/hono-backend/libs/api';

import { honoApp } from '@/core/app';
import { getAdminPermission } from '@/libs/admin/permission';
import { micromatch } from '@/utils/micromatch';

honoApp.use('/api/*', async (ctx, next) => {
    if (
        !ctx.routeHandler?.isHandler
        || ctx.routeHandler.noLoginRequired
        || ctx.routeHandler.permission === 'ignore'
    ) return await next();

    const { isSuperAdmin, permissions } = await getAdminPermission(ctx.adminId!);
    if (isSuperAdmin || micromatch.some(permissions, ctx.routeHandler.permission)) return await next();

    throwApiError(403);
});
