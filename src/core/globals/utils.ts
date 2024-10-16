import type { Request } from '@kikiutils/hyper-express';

declare global {
	const getXForwardedForHeaderFirstValue: (request: Request) => string | undefined;
}

Object.defineProperty(globalThis, 'getXForwardedForHeaderFirstValue', {
	configurable: false,
	value(request: Request) {
		const xForwardedFor = request.headers['x-forwarded-for'];
		if (!xForwardedFor) return;
		const firstCommaIndex = xForwardedFor.indexOf(',');
		const value = firstCommaIndex === -1 ? xForwardedFor : xForwardedFor.substring(0, firstCommaIndex);
		return value.trim();
	},
	writable: false
});
