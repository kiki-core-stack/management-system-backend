import type { AdminDocument } from '@kiki-core-stack/pack/models/admin';

declare module 'hono' {
    interface Context {
        admin?: Nullable<AdminDocument>;
    }
}
