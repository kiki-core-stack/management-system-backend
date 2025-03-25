import { baseSetCookieOptions } from '@kiki-core-stack/pack/hono-backend/constants/cookie';
import type { Context } from 'hono';
import {
    deleteCookie,
    getCookie,
    setCookie,
} from 'hono/cookie';

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
