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
for (const { name, parentPath } of apiFileEntries) {
	try {
		const modulePath = path.join(parentPath, name);
		const apiModule = await import(modulePath);
		if (!apiModule.default) continue;
		const nameParts = path.parse(name).name.split('.');
		if (nameParts.length < 2) continue;
		const method = nameParts.pop()?.toLowerCase() as AllowedApiMethod;
		if (!allowedApiMethods.includes(method)) continue;
		let endpointName = nameParts.join('.').toLowerCase();
		if (endpointName === 'index') endpointName = '';
		const baseRoutePath = path.relative(resolvedApisDirPath, parentPath);
		honoAppWithApisBasePath[method](`${baseRoutePath}${endpointName}`, apiModule.default);
	} catch (error) {
		logger.error(`Loading api file ${parentPath}/${name} error:`, error);
	}
}
