import { create } from 'svg-captcha';

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { noLoginRequired: true } });

export default defineRouteHandler(async (request, response) => {
	const captcha = create({ background: 'transparent', noise: Math.floor(Math.random() * 3) + 2 });
	await setRequestLocalsSession(request, response, 'verCode', captcha.text);
	response.header('content-type', 'image/svg+xml').send(captcha.data);
});
