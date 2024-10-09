import logger from '@kikiutils/node/consola';
import { globSync } from 'glob';
import path from 'path';

type AllowedApiMethod = (typeof allowedApiMethods)[number];

const allowedApiMethods = [
	'delete',
	'get',
	'patch',
	'post',
	'put'
] as const;

const apiFileEntries = globSync('src/apis/**/*.ts', { withFileTypes: true });
const honoAppWithApisBasePath = honoApp.basePath('/api');
const resolvedApisDirPath = path.resolve('./src/apis');
for (const apiFile of apiFileEntries) {
	try {
		const modulePath = path.join(apiFile.parentPath, apiFile.name);
		const apiModule = await import(modulePath);
		if (!apiModule.default) continue;
		const { name: apiBaseName } = path.parse(apiFile.name);
		const apiNameParts = apiBaseName.split('.');
		if (apiNameParts.length < 2) continue;
		const httpMethod = apiNameParts.pop()?.toLowerCase() as AllowedApiMethod;
		if (!allowedApiMethods.includes(httpMethod)) continue;
		let routeEndpoint = apiNameParts.join('.').toLowerCase();
		if (routeEndpoint === 'index') routeEndpoint = '';
		const baseRoutePath = path.relative(resolvedApisDirPath, apiFile.parentPath);
		honoAppWithApisBasePath[httpMethod](`${baseRoutePath}${routeEndpoint}`, apiModule.default);
	} catch (error) {
		logger.error(`Loading api file ${apiFile.parentPath}/${apiFile.name} error:`, error);
	}
}
