import type { MiddlewareHandler } from '@kikiutils/hyper-express';
import { statusCodeToApiResponseTextMap } from '@kikiutils/kiki-core-stack-pack/hyper-express-backend/constants/response';
import { AdminModel } from '@kikiutils/kiki-core-stack-pack/models';

export const adminMiddleware = (): MiddlewareHandler => async (request, response) => {
	if (!request.route.handler.isHandler) return;
	if (request.locals.session.adminId) {
		request.locals.admin = await AdminModel.findById(request.locals.session.adminId);
		if (!request.locals.admin?.enabled) delete request.locals.session.adminId;
	}

	if (request.route.handler.noLoginRequired || request.locals.session.adminId) return;
	response.header('content-type', 'application/json').status(401).send(statusCodeToApiResponseTextMap[401]);
};
