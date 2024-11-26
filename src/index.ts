import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z as zod } from '@kikiutils/kiki-core-stack-pack/constants/zod';
import { setupHonoAppErrorHandling } from '@kikiutils/kiki-core-stack-pack/hono-backend/setups/error-handling';
import '@kikiutils/kiki-core-stack-pack/hono-backend/setups/mongoose-model-statics';
import type { Server } from 'bun';
import nodeProcess from 'node:process';

import { honoApp } from '@/core/app';
import logger from '@/core/utils/logger';
import '@/configs';
import { gracefulExit } from '@/graceful-exit';

let server: Server | undefined;
nodeProcess.once('SIGINT', () => gracefulExit(server));
nodeProcess.once('SIGTERM', () => gracefulExit(server));
(async () => {
    // Extend Zod with OpenAPI
    extendZodWithOpenApi(zod);

    // Import global constants and utilities
    await import('@/core/globals');
    await import('@/globals');

    // Setup error handling
    setupHonoAppErrorHandling(honoApp);

    // Load middlewares
    // eslint-disable-next-line node/prefer-global/process
    await (await import(`@/core/loaders/middlewares/${process.env.NODE_ENV}`)).default();

    // Load routes
    // eslint-disable-next-line node/prefer-global/process
    await (await import(`@/core/loaders/routes/${process.env.NODE_ENV}`)).default();

    // Start server
    server = Bun.serve({
        fetch: honoApp.fetch,
        hostname: nodeProcess.env.SERVER_HOST || '127.0.0.1',
        port: Number(nodeProcess.env.SERVER_PORT) || 8000,
        reusePort: true,
    });

    logger.success(`Started server http://${server.hostname}:${server.port}.`);
})();
