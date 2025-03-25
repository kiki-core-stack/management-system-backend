import type { Types } from 'mongoose';

declare module 'hono' {
    interface Context {
        adminId?: Types.ObjectId;
    }
}
