import { join } from 'node:path';

import logger from '@/core/libs/logger';

import { projectSrcDirectoryPath } from './constants';
import { getMiddlewareFilePaths } from './libs/middleware';
import { scanDirectoryForRoutes } from './libs/router';

async function generateMiddlewaresLoader() {
    const fileLines = ['export default async function () {'];
    const startTime = performance.now();
    logger.info('Starting to generate production middlewares...');
    const middlewareFilePaths = await getMiddlewareFilePaths();
    for (const filePath of middlewareFilePaths) fileLines.push(`    await import('${filePath}');`);
    fileLines.push('}');
    await Bun.write(join(projectSrcDirectoryPath, 'core/loaders/middlewares/production.ts'), `${fileLines.join('\n')}\n`);
    logger.success(`Generated production ${middlewareFilePaths.length} middlewares in ${(performance.now() - startTime).toFixed(2)}ms.`);
}

async function generateRoutesLoader() {
    const fileLines = [
        `import { honoApp } from '@/core/app';`,
        `import { loadRouteModule } from '../libs/router';`,
        'export default async function () {',
    ];

    const startTime = performance.now();
    logger.info('Starting to generate production routes...');
    const scannedRoutes = await scanDirectoryForRoutes(join(projectSrcDirectoryPath, 'routes'), '/');
    for (const { filePath, ...scannedRoute } of scannedRoutes) fileLines.push(`    loadRouteModule(honoApp, await import('${filePath}'), ${JSON.stringify(scannedRoute)});`);
    fileLines.push('}');
    await Bun.write(join(projectSrcDirectoryPath, 'core/loaders/routes/production.ts'), `${fileLines.join('\n')}\n`);
    logger.success(`Generated production ${scannedRoutes.length} routes in ${(performance.now() - startTime).toFixed(2)}ms.`);
}

(async () => await Promise.all([generateMiddlewaresLoader(), generateRoutesLoader()]))();
