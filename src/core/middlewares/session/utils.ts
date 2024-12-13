import type { Context } from 'hono';
import onChange from 'on-change';

import {
    sessionChangedSymbol,
    sessionClearedSymbol,
} from './constants';
import type { ContextSessionData } from './types';

export function clearSession(this: Context) {
    onChange.unsubscribe(this.session);
    this[sessionClearedSymbol] = true;
    this.session = onChange(
        {},
        () => {
            onChange.unsubscribe(this.session);
            delete this[sessionClearedSymbol];
            this[sessionChangedSymbol] = true;
        },
        { ignoreSymbols: true },
    );
}

export function popSession<K extends keyof ContextSessionData>(this: Context, key: K) {
    const value = this.session[key];
    if (value !== undefined) delete this.session[key];
    return value;
}
