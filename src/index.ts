import type { Server } from 'bun';

import { honoApp } from '@/core/app';
import { logger } from '@/core/utils/logger';
import { gracefulExit } from '@/graceful-exit';

let server: Server | undefined;
process.on('SIGINT', () => gracefulExit(server));
process.on('SIGTERM', () => gracefulExit(server));

// Import environment-specific runtime initializers.
// Used for applying side effects like dev-only tooling, schema extensions, etc.
await import(`@/core/runtime-inits/${process.env.NODE_ENV}`);

// Load middlewares
await import(`@/core/loaders/middlewares/${process.env.NODE_ENV}`);

// Load routes
await import(`@/core/loaders/routes/${process.env.NODE_ENV}`);

// Start server
server = Bun.serve({
    fetch: honoApp.fetch,
    hostname: process.env.SERVER_HOST || '127.0.0.1',
    port: Number(process.env.SERVER_PORT) || 8000,
    reusePort: true,
});

logger.success(`Server started at http://${server.hostname}:${server.port}.`);
