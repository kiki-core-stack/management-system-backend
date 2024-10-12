import { redisInstance } from '@kikiutils/kiki-core-stack-pack/constants/redis';
import type { Next } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { nanoid } from 'nanoid';
import onChange from 'on-change';

declare global {
	function clearHonoContextSession(ctx: Context): void;
	function deleteHonoSessionStorageData(token: string): Promise<void>;
	function getHonoSessionToken(ctx: Context): string | undefined;
	function popHonoContextSession<K extends keyof PartialHonoContextSession>(ctx: Context, key: K): PartialHonoContextSession[K];
}

declare module 'hono' {
	interface Context {
		[sessionChangedSymbol]?: true;
		[sessionClearedSymbol]?: true;
		[sessionTokenSymbol]?: string;
		session: Partial<HonoContextSession>;
	}
}

type PartialHonoContextSession = Partial<HonoContextSession>;
type StoredData = [number, PartialHonoContextSession, ip?: string];

export interface HonoContextSession {}

const sessionChangedSymbol = Symbol();
const sessionClearedSymbol = Symbol();
const sessionTokenSymbol = Symbol();

function setSessionToHonoContext(ctx: Context, sessionData: PartialHonoContextSession, onChangeCallback?: (ctx: Context) => void) {
	ctx.session = onChange(
		sessionData,
		() => {
			ctx[sessionChangedSymbol] = true;
			onChange.unsubscribe(ctx.session);
			onChangeCallback?.(ctx);
		},
		{ ignoreSymbols: true }
	);
}

globalThis.clearHonoContextSession = (ctx) => {
	onChange.unsubscribe(ctx.session);
	ctx[sessionChangedSymbol] = ctx[sessionClearedSymbol] = true;
	setSessionToHonoContext(ctx, {}, () => delete ctx[sessionClearedSymbol]);
};

globalThis.deleteHonoSessionStorageData = async (token) => {
	await redisInstance.del(`session:${token}`);
};

globalThis.getHonoSessionToken = (ctx) => ctx[sessionTokenSymbol];
globalThis.popHonoContextSession = (ctx, key) => {
	const value = ctx.session[key];
	delete ctx.session[key];
	return value;
};

export const session = () => {
	return async (ctx: Context, next: Next) => {
		const token = getCookie(ctx, 'session');
		let sessionData: PartialHonoContextSession | undefined;
		if (token) {
			let storedData: StoredData | undefined;
			try {
				const storedDataString = await redisInstance.get(`session:${token}`);
				if (storedDataString) storedData = JSON.parse(storedDataString);
			} catch {}
			if (storedData && storedData[0] + 86400000 >= Date.now()) sessionData = storedData[1];
			if (!sessionData) {
				await redisInstance.del(`session:${token}`);
				deleteCookie(ctx, 'session');
			} else ctx[sessionTokenSymbol] = token;
		}

		setSessionToHonoContext(ctx, sessionData || {});
		await next();
		if (!ctx[sessionChangedSymbol]) return;
		if (ctx[sessionClearedSymbol]) {
			if (ctx[sessionTokenSymbol]) await redisInstance.del(`session:${ctx[sessionTokenSymbol]}`);
			deleteCookie(ctx, 'session');
		} else {
			const toSetToken = ctx[sessionTokenSymbol] || nanoid(64);
			await redisInstance.setex(`session:${toSetToken}`, 86400, JSON.stringify([Date.now(), ctx.session]));
			setCookie(ctx, 'session', toSetToken, {
				httpOnly: true,
				maxAge: 86400,
				secure: true,
				sameSite: 'strict'
			});
		}
	};
};
