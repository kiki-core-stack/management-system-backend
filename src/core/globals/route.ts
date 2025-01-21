import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';

import type { RouteHandlerOptions } from '../types/route';

declare global {
    const defineRouteHandlerOptions: (options: RouteHandlerOptions) => RouteHandlerOptions;
}

setReadonlyConstantToGlobalThis<typeof defineRouteHandlerOptions>('defineRouteHandlerOptions', (options) => options);
