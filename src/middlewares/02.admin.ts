import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import {
    isBefore,
    subDays,
    subMinutes,
} from 'date-fns';
import type { Context } from 'hono';
import type { H } from 'hono/types';

import { honoApp } from '@/core/app';
import type { RouteHandlerProperties } from '@/core/types/route';
import { createOrUpdateAdminSessionAndSetAuthToken } from '@/libs/admin';
import {
    deleteAuthToken,
    getAuthToken,
} from '@/libs/auth';

declare module 'hono' {
    interface Context {
        getAdmin: { (): Promise<AdminDocument> };
    }
}

async function getAdmin(this: Context) {
    const admin = await AdminModel.findById(this.adminId);
    if (!admin) throwApiError();
    return admin;
}

honoApp.use('/api/*', async (ctx, next) => {
    // eslint-disable-next-line style/max-len
    const routeHandler = ctx.req.matchedRoutes[ctx.req.matchedRoutes.length - 1]?.handler as Undefinedable<H & RouteHandlerProperties>;
    if (!routeHandler?.isHandler) return await next();
    const token = getAuthToken(ctx);
    if (token) {
        const adminSession = await AdminSessionModel
            .findOne({ token })
            .select([
                'admin',
                'lastActiveAt',
            ]);

        if (!adminSession) deleteAuthToken(ctx);
        else {
            ctx.adminId = adminSession.admin;
            const today = new Date();
            if (isBefore(adminSession.lastActiveAt, subDays(today, 7))) {
                await adminSession.deleteOne();
                deleteAuthToken(ctx);
                delete ctx.adminId;
            } else if (isBefore(adminSession.lastActiveAt, subMinutes(today, 10))) {
                await createOrUpdateAdminSessionAndSetAuthToken(ctx, adminSession.admin, undefined, adminSession._id);
            }
        }
    }

    ctx.getAdmin = getAdmin.bind(ctx);
    if (routeHandler.noLoginRequired || ctx.adminId) return await next();
    throwApiError(401);
});
