import {
    productionMiddlewaresLoaderPath,
    productionRoutesLoaderPath,
} from './constants/paths';
import { getMiddlewareFilePaths } from './libs/middleware';
import { getRouteDefinitions } from './libs/router';
import { logger } from './utils/logger';

async function generateMiddlewaresLoader() {
    const fileLines = [
        '// @ts-nocheck',
        '',
    ];

    const startTime = performance.now();
    logger.info('Starting to generate production middlewares...');
    const middlewareFilePaths = await getMiddlewareFilePaths();
    for (let i = 0; i < middlewareFilePaths.length; i++) {
        fileLines.push(`export * as middleware${i} from '${middlewareFilePaths[i]}';`);
    }

    await Bun.write(productionMiddlewaresLoaderPath, `${fileLines.join('\n')}\n`);
    // eslint-disable-next-line style/max-len
    logger.success(`Generated production ${middlewareFilePaths.length} middlewares in ${(performance.now() - startTime).toFixed(2)}ms.`);
}

async function generateRoutesLoader() {
    const fileLines = [
        '// @ts-nocheck',
        `import { loadRouteModule } from '../../libs/router';`,
        '',
    ];

    const startTime = performance.now();
    logger.info('Starting to generate production routes...');
    const routeDefinitions = await getRouteDefinitions();
    for (let i = 0; i < routeDefinitions.length; i++) {
        const { filePath } = routeDefinitions[i]!;
        fileLines.push(`import * as route${i} from '${filePath}';`);
    }

    fileLines.push('');
    for (let i = 0; i < routeDefinitions.length; i++) {
        const { filePath, ...routeDefinition } = routeDefinitions[i]!;
        fileLines.push(`loadRouteModule(route${i}, ${JSON.stringify(routeDefinition)});`);
    }

    await Bun.write(productionRoutesLoaderPath, `${fileLines.join('\n')}\n`);
    // eslint-disable-next-line style/max-len
    logger.success(`Generated production ${routeDefinitions.length} routes in ${(performance.now() - startTime).toFixed(2)}ms.`);
}

(async () => await Promise.all([
    generateMiddlewaresLoader(),
    generateRoutesLoader(),
]))();
