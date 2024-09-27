import type { H3Event } from 'h3';

declare module 'h3' {
	interface H3EventContext {}
}

declare global {
	type H3RequestEvent = H3Event;
}
