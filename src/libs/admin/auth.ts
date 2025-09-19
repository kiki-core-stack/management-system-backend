import { AdminLogType } from '@kiki-core-stack/pack/constants/admin';
import { AdminLogModel } from '@kiki-core-stack/pack/models/admin/log';
import type { AdminSession } from '@kiki-core-stack/pack/models/admin/session';
import { AdminSessionModel } from '@kiki-core-stack/pack/models/admin/session';
import { generateWithNestedRandomLength } from '@kikiutils/shared/random';
import type { Context } from 'hono';
import type {
    ClientSession,
    Types,
    UpdateQuery,
} from 'mongoose';
import { nanoid } from 'nanoid';

import { getClientIpFromXForwardedFor } from '@/core/utils/request';

import { setAuthToken } from '../auth';

export async function createOrUpdateAdminSessionAndSetAuthToken(
    ctx: Context,
    adminId: string | Types.ObjectId,
    options?: {
        ip?: string;
        mongooseSession?: ClientSession;
        sessionId?: Types.ObjectId;
    },
) {
    const ip = options?.ip || getClientIpFromXForwardedFor(ctx);
    const updateQuery: UpdateQuery<AdminSession> = {
        admin: adminId,
        lastActiveAt: new Date(),
        lastActiveIp: ip,
        token: generateWithNestedRandomLength(nanoid, 48, 64, 80, 96),
        userAgent: ctx.req.header('User-Agent'),
    };

    if (options?.sessionId) {
        await AdminSessionModel.assertUpdateSuccess(
            { _id: options.sessionId },
            updateQuery,
            { session: options.mongooseSession },
        );
    } else {
        updateQuery.loginIp = ip;
        await AdminSessionModel.create([updateQuery], { session: options?.mongooseSession });
    }

    setAuthToken(ctx, 'admin', updateQuery.token);
}

export async function handleAdminLogin(
    ctx: Context,
    adminId: string | Types.ObjectId,
    session?: ClientSession,
    logNote?: string,
) {
    const ip = getClientIpFromXForwardedFor(ctx);
    await createOrUpdateAdminSessionAndSetAuthToken(
        ctx,
        adminId,
        {
            ip,
            mongooseSession: session,
        },
    );

    await AdminLogModel.create(
        [
            {
                admin: adminId,
                ip,
                note: logNote,
                type: AdminLogType.LoginSuccess,
            },
        ],
        { session },
    );
}
