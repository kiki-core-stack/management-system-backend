import { baseSetCookieOptions } from '@kiki-core-stack/pack/hono-backend/constants/cookie';
import { getManagementSystemTypeFromRoutePath } from '@kiki-core-stack/pack/libs/management-system';
import type { ManagementSystemType } from '@kiki-core-stack/pack/types';
import type { Context } from 'hono';
import {
    deleteCookie,
    getCookie,
    setCookie,
} from 'hono/cookie';

export function deleteAuthToken(ctx: Context, systemType?: ManagementSystemType) {
    return deleteCookie(ctx, resolveAuthTokenName(ctx, systemType));
}

export function getAuthToken(ctx: Context, systemType?: ManagementSystemType) {
    return getCookie(ctx, resolveAuthTokenName(ctx, systemType));
}

function resolveAuthTokenName(ctx: Context, systemType?: ManagementSystemType) {
    systemType ??= getManagementSystemTypeFromRoutePath(ctx.req.path);
    if (!systemType) throw new Error('No management system type found');
    return `${systemType}-token`;
}

export function setAuthToken(ctx: Context, token: string, systemType?: ManagementSystemType) {
    setCookie(
        ctx,
        resolveAuthTokenName(ctx, systemType),
        token,
        {
            ...baseSetCookieOptions,
            maxAge: 86400 * 7,
        },
    );
}
