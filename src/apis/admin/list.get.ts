import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineRouteHandler(async (request, response) => await sendPaginatedModelDataResponse(request, response, AdminModel));
