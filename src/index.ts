import '@kiki-core-stack/pack/hono-backend/setups/mongoose-model-statics/find-by-route-id-or-throw-not-found-error';
import '@kiki-core-stack/pack/hono-backend/setups/mongoose-model-statics';

import type { Server } from 'bun';
import { join } from 'node:path';

import { setupHonoAppErrorHandling } from '@kiki-core-stack/pack/hono-backend/setups/error-handling';
import { capitalize } from 'es-toolkit';

import { honoApp } from '@/core/app';
import { logger } from '@/core/utils/logger';
import { gracefulExit } from '@/graceful-exit';

let server: Server | undefined;
process.on('SIGINT', () => gracefulExit(server));
process.on('SIGTERM', () => gracefulExit(server));

// Setup error handling
setupHonoAppErrorHandling(honoApp, logger);

// Import environment-specific runtime initializers.
// Used for applying side effects like dev-only tooling, schema extensions, etc.
await import(`@/core/runtime-inits/${process.env.NODE_ENV}`);

// Load middlewares
await import(`@/core/loaders/middlewares/${process.env.NODE_ENV}`);

// Load routes
await import(`@/core/loaders/routes/${process.env.NODE_ENV}`);

// Generate admin permission files
if (process.env.NODE_ENV === 'development') {
    const { writeManagementSystemPermissionTypesFile } = await import('@kiki-core-stack/pack/libs/management-system');
    const baseGeneratedStaticTypesDirPath = join(
        (await import('@/core/constants/paths')).projectSrcDirPath,
        'generated',
        'static',
        'types',
    );

    const managementSystemTypes: ManagementSystemType[] = ['admin'];
    await Promise.all(
        managementSystemTypes.map(async (managementSystemType) => {
            logger.info(`Generating ${managementSystemType} permission types...`);
            const module = await await import(`@/constants/${managementSystemType}`);
            const allPermissions: Set<string> = module[`all${capitalize(managementSystemType)}Permissions`];
            await writeManagementSystemPermissionTypesFile(
                managementSystemType,
                [...allPermissions],
                join(baseGeneratedStaticTypesDirPath, managementSystemType, 'permission.ts'),
            );

            logger.success(`Generated ${managementSystemType} permission types`);
        }),
    );
}

// Start server
logger.info('Starting server...');
server = Bun.serve({
    fetch: honoApp.fetch,
    hostname: process.env.SERVER_HOST || '127.0.0.1',
    port: Number(process.env.SERVER_PORT) || 8000,
    reusePort: true,
});

logger.success(`Server started at http://${server.hostname}:${server.port}`);
