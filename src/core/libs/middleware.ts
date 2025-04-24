import { glob } from 'node:fs/promises';

import { middlewaresDirPath } from '../constants/paths';

export async function getMiddlewareFilePaths() {
    const allFilePaths = await Array.fromAsync(glob(`${middlewaresDirPath}/**/*.{mj,t}s`, {}));
    const excludedEnvSuffix = process.env.NODE_ENV === 'production' ? 'dev' : 'prod';
    const filePattern = new RegExp(`^.*(?<!\\.${excludedEnvSuffix})\\.(mj|t)s$`);
    return allFilePaths.filter((filePath) => filePattern.test(filePath)).sort();
}
