import { baseSetCookieOptions } from '@kiki-core-stack/pack/hono-backend/constants/cookie';
import type { AdminSession } from '@kiki-core-stack/pack/models/admin/session';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import type { Context } from 'hono';
import {
    deleteCookie,
    getCookie,
    setCookie,
} from 'hono/cookie';
import { random } from 'lodash-es';
import type {
    Types,
    UpdateQuery,
} from 'mongoose';
import { nanoid } from 'nanoid';

export async function createOrUpdateAdminSessionAndSetAuthToken(
    ctx: Context,
    adminId: string | Types.ObjectId,
    sessionId?: Types.ObjectId,
) {
    const updateQuery: UpdateQuery<AdminSession> = {
        admin: adminId,
        lastActiveAt: new Date(),
        lastActiveIp: getXForwardedForHeaderFirstValue(ctx),
        token: nanoid(random(32, 48)),
        userAgent: ctx.req.header('User-Agent'),
    };

    if (!sessionId) updateQuery.loginIP = getXForwardedForHeaderFirstValue(ctx);
    const adminSession = await AdminSessionModel.findByIdAndUpdate(
        sessionId,
        updateQuery,
        {
            new: true,
            upsert: true,
        },
    );

    setAuthToken(ctx, adminSession.token);
}

export const deleteAuthToken = (ctx: Context) => deleteCookie(ctx, 'token');
export const getAuthToken = (ctx: Context) => getCookie(ctx, 'token');

export function setAuthToken(ctx: Context, token: string) {
    setCookie(
        ctx,
        'token',
        token,
        {
            ...baseSetCookieOptions,
            maxAge: 86400 * 7,
        },
    );
}
