import type { H } from 'hono/types';
import type { Types } from 'mongoose';

import type { RouteHandlerProperties } from '@/core/types/route';

declare module 'hono' {
    interface Context {
        adminId?: Types.ObjectId;
        routeHandler?: H & RouteHandlerProperties & { permission: 'ignore' | (string & {}) };
    }
}
