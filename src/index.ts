import '@kiki-core-stack/pack/hono-backend/setups/mongoose-model-statics/find-by-route-id-or-throw-not-found-error';
import '@kiki-core-stack/pack/hono-backend/setups/mongoose-model-statics';

import type { Server } from 'bun';

import { setupHonoAppErrorHandling } from '@kiki-core-stack/pack/hono-backend/setups/error-handling';

import { honoApp } from '@/core/app';
import { logger } from '@/core/utils/logger';
import { gracefulExit } from '@/graceful-exit';

let server: Server<any> | undefined;
process.on('SIGINT', () => gracefulExit(server));
process.on('SIGTERM', () => gracefulExit(server));

// Setup error handling
setupHonoAppErrorHandling(honoApp, logger);

// Import environment-specific runtime initializers.
// Used for applying side effects like dev-only tooling, schema extensions, etc.
await import(`@/core/runtime-inits/${process.env.NODE_ENV}`);

// Initialize system defaults
await (await import('@kiki-core-stack/pack/init')).initializeSystemDefaults();

// Load middlewares
await import('@/middlewares');

// Load routes
await import(`@/core/loaders/routes/${process.env.NODE_ENV}`);

// Generate permission files
if (process.env.NODE_ENV === 'development') await import('@/generate-permission-files');

// Start server
logger.info('Starting server...');
server = Bun.serve({
    fetch: honoApp.fetch,
    hostname: process.env.SERVER_HOST || '127.0.0.1',
    port: Number(process.env.SERVER_PORT) || 8000,
    reusePort: true,
});

logger.success(`Server started at http://${server.hostname}:${server.port}`);
