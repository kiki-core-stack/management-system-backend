/**
 * All paths are for development only.
 */

import {
    join,
    resolve,
    sep,
} from 'node:path';

export const projectRoot = resolve(import.meta.dirname, '../../../').replaceAll(sep, '/');
export const projectSrcDirPath = join(projectRoot, 'src');
export const middlewaresDirPath = join(projectSrcDirPath, 'middlewares');
export const productionMiddlewaresLoaderPath = join(projectSrcDirPath, 'core/loaders/middlewares/production.ts');
export const productionRoutesLoaderPath = join(projectSrcDirPath, 'core/loaders/routes/production.ts');
export const routesDirPath = join(projectSrcDirPath, 'routes');
