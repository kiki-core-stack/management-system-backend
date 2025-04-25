import { writeFile } from 'node:fs/promises';

import { resolveModuleExportNames } from 'mlly';

import { productionRoutesLoaderPath } from '../constants/paths';
import { getRouteDefinitions } from '../libs/router';
import type { RouteDefinition } from '../types/route';
import { logger } from '../utils/logger';

const importLines: string[] = [];
const stringConstantLines: string[] = [];
const fileLines = [
    '// @ts-nocheck',
    `import { registerRoute } from '../../libs/router';`,
    '',
    importLines,
    '',
    stringConstantLines,
    '',
];

const valueToVariableNameMap = new Map<string, string>();

async function generateRouteCode(routeDefinition: RouteDefinition, index: number) {
    const moduleExports = await resolveModuleExportNames(routeDefinition.filePath);
    if (!moduleExports.includes('default')) throw new Error(`No default export found in ${routeDefinition.filePath}.`);
    const importName = `route${index}`;
    importLines.push(`import * as ${importName} from '${routeDefinition.filePath}';`);
    let line = `registerRoute(`;
    line += `${getOrGenerateStringConstantName(routeDefinition.method)},`;
    line += ` ${getOrGenerateStringConstantName(routeDefinition.path)},`;
    line += ` [${importName}.default].flat().filter(Boolean),`;
    if (moduleExports.includes('routeHandlerOptions')) line += ` ${importName}.routeHandlerOptions,`;
    // Remove false if you need OpenAPI metadata in production
    if (false && moduleExports.includes('zodOpenApiConfig')) {
        // eslint-disable-next-line style/max-len
        line += ` { config: ${importName}.zodOpenApiConfig, path: ${getOrGenerateStringConstantName(routeDefinition.openApiPath)} }`;
    }

    return `${line.replace(/,$/, '')});`;
}

function getOrGenerateStringConstantName(value: string) {
    if (!valueToVariableNameMap.has(value)) {
        const variableName = `v${Math.random().toString(36).slice(2, 10)}`;
        stringConstantLines.push(`const ${variableName} = '${value}';`);
        valueToVariableNameMap.set(value, variableName);
    }

    return valueToVariableNameMap.get(value)!;
}

const startTime = performance.now();
logger.info('Starting to generate production routes...');
const generatedCodes = await Promise.all((await getRouteDefinitions()).map(generateRouteCode));
fileLines.push(...generatedCodes);
await writeFile(productionRoutesLoaderPath, `${fileLines.flat().join('\n')}\n`);
logger.success(
    `Generated production ${generatedCodes.length} routes in ${(performance.now() - startTime).toFixed(2)}ms.`,
);
