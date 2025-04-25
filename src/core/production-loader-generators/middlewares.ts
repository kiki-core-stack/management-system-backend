import { writeFile } from 'node:fs/promises';

import { productionMiddlewaresLoaderPath } from '../constants/paths';
import { getMiddlewareFilePaths } from '../libs/middleware';
import { logger } from '../utils/logger';

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

await writeFile(productionMiddlewaresLoaderPath, `${fileLines.join('\n')}\n`);
// eslint-disable-next-line style/max-len
logger.success(`Generated production ${middlewareFilePaths.length} middlewares in ${(performance.now() - startTime).toFixed(2)}ms.`);
