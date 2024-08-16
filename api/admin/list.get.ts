import { AdminModel } from '@kikiutils/el-plus-admin-pack/models';

export default defineEventHandler(async (event) => await modelToPaginatedResponseData(event, AdminModel));
