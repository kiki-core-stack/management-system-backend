import { AdminLogType } from '@kiki-core-stack/pack/constants/admin';
import { AdminLogModel } from '@kiki-core-stack/pack/models/admin/log';
import type { AdminSession } from '@kiki-core-stack/pack/models/admin/session';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import type { Context } from 'hono';
import { random } from 'lodash-es';
import type {
    Types,
    UpdateQuery,
} from 'mongoose';
import { nanoid } from 'nanoid';

import { setAuthToken } from '../auth';

export async function createOrUpdateAdminSessionAndSetAuthToken(
    ctx: Context,
    adminId: string | Types.ObjectId,
    ip?: string,
    sessionId?: Types.ObjectId,
) {
    ip ||= getXForwardedForHeaderFirstValue(ctx);
    const updateQuery: UpdateQuery<AdminSession> = {
        admin: adminId,
        lastActiveAt: new Date(),
        lastActiveIp: ip,
        token: nanoid(random(32, 48)),
        userAgent: ctx.req.header('User-Agent'),
    };

    if (!sessionId) {
        updateQuery.loginIp = ip;
        await AdminSessionModel.create(updateQuery);
    } else if (!await AdminSessionModel.findByIdAndUpdate(sessionId, updateQuery)) throwApiError();
    setAuthToken(ctx, updateQuery.token);
}

export async function handleAdminLogin(ctx: Context, adminId: string | Types.ObjectId) {
    const ip = getXForwardedForHeaderFirstValue(ctx);
    await createOrUpdateAdminSessionAndSetAuthToken(ctx, adminId, ip);
    AdminLogModel.create({
        admin: adminId,
        ip,
        type: AdminLogType.LoginSuccess,
    }).catch(() => {});
}
