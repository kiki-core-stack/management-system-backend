import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';

import { defaultHonoFactory } from '@/core/constants/hono';
import { getAuthToken } from '@/libs/auth';

export const routePermission = 'ignore';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    const adminSessions = await AdminSessionModel.find({ admin: ctx.adminId }).sort({ lastActiveAt: -1 });
    const token = getAuthToken(ctx);
    const adminSessionList = [];
    for (const adminSession of adminSessions) {
        if (adminSession.token === token) adminSessionList.unshift(adminSession.toJSON());
        else adminSessionList.push(adminSession.toJSON());
    }

    adminSessionList[0]!.isCurrent = true;
    return ctx.createApiSuccessResponse({
        count: adminSessionList.length,
        list: adminSessionList,
    });
});
