import type { Endpoint } from 'hono/types';

declare global {
	type StatusCode = Endpoint['status'];
}
