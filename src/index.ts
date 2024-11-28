import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import type { Server } from 'bun';
import nodeProcess from 'node:process';
import { z as zod } from 'zod';

import { honoApp } from '@/core/app';
import logger from '@/core/utils/logger';
import { gracefulExit } from '@/graceful-exit';

let server: Server | undefined;
nodeProcess.once('SIGINT', () => gracefulExit(server));
nodeProcess.once('SIGTERM', () => gracefulExit(server));
(async () => {
    // Extend Zod with OpenAPI
    extendZodWithOpenApi(zod);

    // Import global constants and utilities
    await import('@/core/globals');

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
