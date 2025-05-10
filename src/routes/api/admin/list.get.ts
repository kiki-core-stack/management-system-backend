import { AdminModel } from '@kiki-core-stack/pack/models/admin';

import { defaultHonoFactory } from '@/core/constants/hono';
import { paginateModelDataWithApiResponse } from '@/libs/response';

export default defaultHonoFactory.createHandlers((ctx) => paginateModelDataWithApiResponse(ctx, AdminModel));
