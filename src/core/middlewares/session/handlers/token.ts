import { deleteCookie, getCookie, setCookie } from 'hono/cookie';

import type { SessionTokenHandler } from '../types';

const setCookieOptions = Object.freeze({
    httpOnly: true,
    maxAge: 86400,
    path: '/',
    sameSite: 'strict',
    secure: true,
});

export const cookieSessionTokenHandler: SessionTokenHandler = Object.freeze({
    delete: (ctx) => deleteCookie(ctx, 'session'),
    get: (ctx) => getCookie(ctx, 'session'),
    set: (ctx, value) => setCookie(ctx, 'session', value, setCookieOptions),
});

export const headerSessionTokenHandler: SessionTokenHandler = Object.freeze({
    delete: (ctx) => ctx.header('set-session', ''),
    get: (ctx) => ctx.req.header('session'),
    set: (ctx, value) => ctx.header('set-session', value),
});
