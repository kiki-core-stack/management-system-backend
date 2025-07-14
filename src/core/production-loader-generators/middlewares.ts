import { productionMiddlewaresLoaderPath } from '../constants/paths';
import { getMiddlewareFilePaths } from '../libs/middleware';
import { logger } from '../utils/logger';

const outputLines = [
    '// @ts-nocheck', // Suppress type checking for generated file
    '',
];

const startTime = performance.now();
logger.info('Generating production middleware loader...');
const middlewarePaths = await getMiddlewareFilePaths();
middlewarePaths.forEach((path) => outputLines.push(`export {} from '${path}';`));
await Bun.write(productionMiddlewaresLoaderPath, `${outputLines.join('\n')}\n`);
logger.success(
    `Generated ${middlewarePaths.length} production middlewares in ${(performance.now() - startTime).toFixed(2)}ms`,
);
