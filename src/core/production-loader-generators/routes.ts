import { writeFile } from 'node:fs/promises';

import { productionRoutesLoaderPath } from '../constants/paths';
import { getRouteDefinitions } from '../libs/router';
import { logger } from '../utils/logger';

const fileLines = [
    '// @ts-nocheck',
    `import { registerRoute } from '../../libs/router';`,
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
    fileLines.push(`await registerRoute('${routeDefinition.method}', '${routeDefinition.path}');`);
}

await writeFile(productionRoutesLoaderPath, `${fileLines.join('\n')}\n`);
logger.success(
    `Generated production ${routeDefinitions.length} routes in ${(performance.now() - startTime).toFixed(2)}ms.`,
);
