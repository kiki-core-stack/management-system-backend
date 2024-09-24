import { create } from 'svg-captcha';

export default defineEventHandler(async (event) => {
	const captcha = create({ background: 'transparent', noise: Math.floor(Math.random() * 3) + 2 });
	event.context.session.verCode = captcha.text;
	defaultContentType(event, 'image/svg+xml');
	return captcha.data;
});
