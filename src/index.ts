import '@kiki-core-stack/pack/hono-backend/setups/mongoose-model-statics';
import '@/configs';

import type { Server } from 'bun';

import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z as zod } from '@kiki-core-stack/pack/constants/zod';
import { setupHonoAppErrorHandling } from '@kiki-core-stack/pack/hono-backend/setups/error-handling';

import { honoApp } from '@/core/app';
import logger from '@/core/utils/logger';
import { gracefulExit } from '@/graceful-exit';

let server: Server | undefined;
process.once('SIGINT', () => gracefulExit(server));
process.once('SIGTERM', () => gracefulExit(server));
(async () => {
    // Extend Zod with OpenAPI
    extendZodWithOpenApi(zod);

    // Setup error handling
    setupHonoAppErrorHandling(honoApp);

    // Load middlewares
    await (await import(`@/core/loaders/middlewares/${process.env.NODE_ENV}`)).default();

    // Load routes
    await (await import(`@/core/loaders/routes/${process.env.NODE_ENV}`)).default();

    // Start server
    server = Bun.serve({
        fetch: honoApp.fetch,
        hostname: process.env.SERVER_HOST || '127.0.0.1',
        port: Number(process.env.SERVER_PORT) || 8000,
        reusePort: true,
    });

    logger.success(`Started server http://${server.hostname}:${server.port}.`);
})();
