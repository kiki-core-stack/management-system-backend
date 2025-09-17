import { baseSetCookieOptions } from '@kiki-core-stack/pack/hono-backend/constants/cookie';
import type { Context } from 'hono';
import {
    deleteCookie,
    getCookie,
    setCookie,
} from 'hono/cookie';

export const deleteAuthToken = (ctx: Context, type: ManagementSystemType) => deleteCookie(ctx, `${type}-token`);
export const getAuthToken = (ctx: Context, type: ManagementSystemType) => getCookie(ctx, `${type}-token`);

export function setAuthToken(ctx: Context, type: ManagementSystemType, token: string) {
    setCookie(
        ctx,
        `${type}-token`,
        token,
        {
            ...baseSetCookieOptions,
            maxAge: 86400 * 7,
        },
    );
}
