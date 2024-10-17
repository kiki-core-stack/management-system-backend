import type { Request, Response } from '@kikiutils/hyper-express';
import { nanoid } from 'nanoid';

import { sessionStorage } from '../constants';
import type { PartialRequestLocalsSession } from '../types';

type StoredData = [number, PartialRequestLocalsSession, ip?: string];

export class Session {
	#request: Request;
	#response: Response;
	#token?: string;

	constructor(request: Request, response: Response) {
		this.#request = request;
		this.#response = response;
		this.#token = request.headers.session;
	}

	async #save() {
		if (!this.#token) this.#token = nanoid(64);
		await sessionStorage.setItem(this.#token, [Date.now(), this.#request.locals.session], { ttl: 86400 });
		this.#response.header('set-session', this.#token, true);
	}

	get token() {
		return this.#token;
	}

	async clear() {
		if (this.#token) await sessionStorage.removeItem(this.#token);
		this.#request.locals.session = {};
		this.#response.header('set-session', '', true);
		this.#token = undefined;
	}

	get(key: keyof PartialRequestLocalsSession) {
		return this.#request.locals.session[key];
	}

	async init() {
		let sessionData: PartialRequestLocalsSession | undefined;
		if (this.#token) {
			let storedData: Nullable<StoredData> = null;
			try {
				storedData = await sessionStorage.getItem<StoredData>(this.#token);
			} catch {}
			if (storedData && storedData[0] + 86400000 >= Date.now()) sessionData = storedData[1];
			else return await this.clear();
		}

		this.#request.locals.session = sessionData || {};
	}

	async pop(key: keyof PartialRequestLocalsSession) {
		const value = this.#request.locals.session[key];
		delete this.#request.locals.session[key];
		if (value !== undefined) await this.#save();
		return value;
	}

	async set<K extends keyof PartialRequestLocalsSession>(key: K, value: PartialRequestLocalsSession[K]) {
		this.#request.locals.session[key] = value;
		await this.#save();
	}
}
