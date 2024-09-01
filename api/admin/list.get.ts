import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export default defineEventHandler(async (event) => await modelToPaginatedResponseData(event, AdminModel));
