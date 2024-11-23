import { glob } from 'glob';
import { join, resolve, sep } from 'node:path';
import { env } from 'node:process';

import { projectSrcDirectoryPath } from '../constants';

export async function getMiddlewareFilePaths() {
    const directoryPath = resolve(join(projectSrcDirectoryPath, 'middlewares')).replaceAll(sep, '/');
    const allFilePaths = await glob(`${directoryPath}/**/*.{mj,t}s`);
    const environment = env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const filePattern = new RegExp(`^${directoryPath}(.*?)(\\.${environment})?\\.(mj|t)s$`);
    return allFilePaths.filter((filePath) => filePattern.test(filePath)).sort();
}
