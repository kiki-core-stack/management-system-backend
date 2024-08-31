import { AdminModel } from '@kikiutils/el-plus-admin-pack/models';

const allowNoAuthPaths = new Set([
	'/api/admin/auth/login',
	'/api/admin/auth/otp/email/send',
	'/api/admin/info',
	'/api/ver-code'
]);

export default defineEventHandler(async (event) => {
	if (!event.path.startsWith('/api')) return;
	if (event.context.session.adminId) {
		event.context.admin = await AdminModel.findById(event.context.session.adminId);
		if (!event.context.admin?.enabled) delete event.context.session.adminId;
	}

	if (!event.context.session.adminId) {
		const qMarkIndex = event.path.indexOf('?');
		if (!allowNoAuthPaths.has(qMarkIndex === -1 ? event.path : event.path.substring(0, qMarkIndex))) createApiErrorAndThrow(401);
	}
});
