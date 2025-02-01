import { glob } from 'node:fs/promises';
import {
    join,
    resolve,
    sep,
} from 'node:path';

export async function getMiddlewareFilePaths() {
    const directoryPath = resolve(join(import.meta.dirname, '../../middlewares')).replaceAll(sep, '/');
    const allFilePaths = await Array.fromAsync(glob(`${directoryPath}/**/*.{mj,t}s`, {}));
    const excludedEnvSuffix = process.env.NODE_ENV === 'production' ? 'dev' : 'prod';
    const filePattern = new RegExp(`^.*(?<!\\.${excludedEnvSuffix})\\.(mj|t)s$`);
    return allFilePaths.filter((filePath) => filePattern.test(filePath)).sort();
}
