import '@kiki-core-stack/pack/hono-backend/setups/mongoose-model-statics';

import type { Server } from 'bun';

import { setupHonoAppErrorHandling } from '@kiki-core-stack/pack/hono-backend/setups/error-handling';

import { honoApp } from '@/core/app';
import { logger } from '@/core/utils/logger';
import { gracefulExit } from '@/graceful-exit';

let server: Server | undefined;
process.once('SIGINT', () => gracefulExit(server));
process.once('SIGTERM', () => gracefulExit(server));

// Setup error handling
setupHonoAppErrorHandling(honoApp, logger);

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
