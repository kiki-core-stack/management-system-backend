import { glob } from 'glob';
import { resolve, sep } from 'path';

const allowedHttpMethods = [
	'delete',
	'get',
	'head',
	'options',
	'patch',
	'post',
	'purge',
	'put'
] as const;

export const scanDirectoryForRoutes = async (directoryPath: string, baseUrlPath: string) => {
	directoryPath = resolve(directoryPath).replaceAll(sep, '/');
	const allFilePaths = (await glob(`${directoryPath}/**/*.{mj,t}s`)).sort((a, b) => {
		const aSegments = a.split('/');
		const bSegments = b.split('/');
		for (let i = 0; i < Math.min(aSegments.length, bSegments.length); i++) {
			if (aSegments[i] !== bSegments[i]) {
				if (aSegments[i]?.startsWith('[') && aSegments[i]?.endsWith(']')) return 1;
				if (bSegments[i]?.startsWith('[') && bSegments[i]?.endsWith(']')) return -1;
				return 0;
			}
		}

		return aSegments.length - bSegments.length;
	});

	const environment = process.env.NODE_ENV === 'production' ? 'prod' : 'dev';
	const filePattern = new RegExp(`^${directoryPath}(.*?)(\/index)?\\.(${allowedHttpMethods.join('|')})(\\.${environment})?\\.(mj|t)s$`);
	const matchedRoutes = [];
	for (const filePath of allFilePaths) {
		const matches = filePath.match(filePattern);
		if (!matches) continue;
		const normalizedRoutePath = `${baseUrlPath}${matches[1]!}`.replaceAll(/\/+/g, '/');
		matchedRoutes.push({
			filePath,
			method: matches[3]!,
			openAPIPath: normalizedRoutePath.replaceAll(/\[([^/]+)\]/g, '{$1}'),
			path: normalizedRoutePath.replaceAll(/\[([^/]+)\]/g, ':$1')
		});
	}

	return matchedRoutes;
};
