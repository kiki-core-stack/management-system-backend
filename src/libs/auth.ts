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
