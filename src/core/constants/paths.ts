/**
 * All paths are for development only.
 */

import {
    join,
    resolve,
    sep,
} from 'node:path';

export const projectRoot = /* @__PURE__ */ resolve(import.meta.dirname, '../../../').replaceAll(sep, '/');
export const projectSrcDirPath = /* @__PURE__ */ join(projectRoot, 'src');
export const middlewaresDirPath = /* @__PURE__ */ join(projectSrcDirPath, 'middlewares');
// eslint-disable-next-line style/max-len
export const productionMiddlewaresLoaderPath = /* @__PURE__ */ join(projectSrcDirPath, 'core/loaders/middlewares/production.ts');
export const productionRoutesLoaderPath = /* @__PURE__ */ join(projectSrcDirPath, 'core/loaders/routes/production.ts');
export const routesDirPath = /* @__PURE__ */ join(projectSrcDirPath, 'routes');
