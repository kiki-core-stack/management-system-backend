import { resolveModuleExportNames } from 'mlly';

import { productionRoutesLoaderPath } from '../constants/paths';
import { getRouteDefinitions } from '../libs/router';
import type { RouteDefinition } from '../types/route';
import { logger } from '../utils/logger';

const importStatements: string[] = [];
const constantDeclarations: string[] = [];
const usedConstNames = new Set<string>();
const valueToConstMap = new Map<string, string>();

async function applyRouteFragments(routeDefinition: RouteDefinition, index: number) {
    const moduleExports = await resolveModuleExportNames(routeDefinition.filePath);
    if (!moduleExports.includes('default')) {
        throw new Error(`No default export found in route at ${routeDefinition.filePath}`);
    }

    if (!moduleExports.includes('routePermission')) {
        throw new Error(`No routePermission found in route at ${routeDefinition.filePath}`);
    }

    const importAlias = `route${index}`;
    importStatements.push(`import * as ${importAlias} from '${routeDefinition.filePath}';`);
    const methodConstName = getOrCreateConstName(routeDefinition.method);
    const pathConstName = getOrCreateConstName(routeDefinition.path);
    // eslint-disable-next-line style/max-len
    let registration = `registerRoute(${methodConstName}, ${pathConstName}, processRouteHandlers(${importAlias}.default), ${importAlias}.routePermission,`;
    if (moduleExports.includes('routeHandlerOptions')) registration += ` ${importAlias}.routeHandlerOptions,`;

    // Remove the next line if you need OpenAPI metadata in production.
    if (process.env.NODE_ENV === 'production') return `${registration.replace(/,\s*$/, '')});`;

    const hasGetZodOpenApiConfig = moduleExports.includes('getZodOpenApiConfig');
    const hasZodOpenApiConfig = moduleExports.includes('zodOpenApiConfig');
    if (hasGetZodOpenApiConfig && hasZodOpenApiConfig) {
        throw new Error(`Both getZodOpenApiConfig and zodOpenApiConfig found for route at ${routeDefinition.filePath}`);
    }

    const openApiPathConstName = getOrCreateConstName(routeDefinition.openApiPath);
    if (hasGetZodOpenApiConfig) {
        registration += ` { config: ${importAlias}.getZodOpenApiConfig(), path: ${openApiPathConstName} },`;
    } else if (hasZodOpenApiConfig) {
        // eslint-disable-next-line style/max-len
        logger.warn(`To optimize tree shaking in production, it is recommended to use getZodOpenApiConfig instead of zodOpenApiConfig at ${routeDefinition.filePath}`);
        registration += ` { config: ${importAlias}.zodOpenApiConfig, path: ${openApiPathConstName} },`;
    }

    return `${registration.replace(/,\s*$/, '')});`;
}

function getOrCreateConstName(value: string) {
    if (valueToConstMap.has(value)) return valueToConstMap.get(value)!;

    let constName: string;
    do constName = `v${Math.random().toString(36).substring(2)}`;
    while (usedConstNames.has(constName));

    constantDeclarations.push(`const ${constName} = '${value}';`);
    usedConstNames.add(constName);
    valueToConstMap.set(value, constName);

    return constName;
}

const startTime = performance.now();
logger.info('Generating production routes loader...');
const registrationLines = await Promise.all((await getRouteDefinitions()).map(applyRouteFragments));
const outputLines = [
    '// @ts-nocheck',
    `import { processRouteHandlers, registerRoute } from '../../libs/router';`,
    '',
    ...importStatements,
    '',
    ...constantDeclarations,
    '',
    ...registrationLines,
];

await Bun.write(productionRoutesLoaderPath, `${outputLines.join('\n').trim()}\n`);
logger.success(
    `Generated ${registrationLines.length} production routes in ${(performance.now() - startTime).toFixed(2)}ms`,
);
