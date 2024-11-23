import { join } from 'node:path';

import logger from '@/core/libs/logger';

import { projectSrcDirectoryPath } from './constants';
import { scanDirectoryForRoutes } from './libs/router';

(async () => {
    const routesFileLines = [
        `import { honoApp } from '@/core/app';`,
        `import { loadRouteModule } from '../libs/router';`,
        'export default async function () {',
    ];

    const startTime = performance.now();
    logger.info('Starting to generate production routes...');
    const scannedRoutes = await scanDirectoryForRoutes(join(projectSrcDirectoryPath, 'routes'), '/');
    for (const { filePath, ...scannedRoute } of scannedRoutes) routesFileLines.push(`    loadRouteModule(honoApp, await import('${filePath}'), ${JSON.stringify(scannedRoute)})`);
    routesFileLines.push('};');
    await Bun.write(join(projectSrcDirectoryPath, 'core/routes-loader/production.ts'), `${routesFileLines.join('\n')}\n`);
    logger.success(`Generated production ${scannedRoutes.length} routes in ${(performance.now() - startTime).toFixed(2)}ms.`);
})();
