import { create } from 'svg-captcha';

export const handlerProperties = Object.freeze({ noLoginRequired: true });

export default defineRouteHandler(async (ctx) => {
	const captcha = create({ background: 'transparent', noise: Math.floor(Math.random() * 3) + 2 });
	ctx.session.verCode = captcha.text;
	ctx.header('Content-Type', 'image/svg+xml');
	return ctx.body(captcha.data);
});
