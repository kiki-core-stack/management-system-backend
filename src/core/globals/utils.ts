import type { Request } from '@kikiutils/hyper-express';

declare global {
	function getXForwardedForHeaderFirstValue(request: Request): string | undefined;
}

globalThis.getXForwardedForHeaderFirstValue = (request) => {
	const xForwardedFor = request.header('x-forwarded-for');
	if (!xForwardedFor) return;
	const firstCommaIndex = xForwardedFor.indexOf(',');
	const value = firstCommaIndex === -1 ? xForwardedFor : xForwardedFor.substring(0, firstCommaIndex);
	return value.trim();
};
