import { glob } from 'glob';
import { join, resolve, sep } from 'node:path';
import { env } from 'node:process';

import { projectSrcDirectoryPath } from '../constants';

export async function getMiddlewareFilePaths() {
    const directoryPath = resolve(join(projectSrcDirectoryPath, 'middlewares')).replaceAll(sep, '/');
    const allFilePaths = await glob(`${directoryPath}/**/*.{mj,t}s`);
    const excludedEnvSuffix = env.NODE_ENV === 'production' ? 'dev' : 'prod';
    const filePattern = new RegExp(`^.*(?<!\\.${excludedEnvSuffix})\\.(mj|t)s$`);
    return allFilePaths.filter((filePath) => filePattern.test(filePath)).sort();
}
