import { cloneDeep as _cloneDeep, merge as _merge, omit as _omit, pick as _pick } from 'lodash-es';

declare global {
	const cloneDeep: typeof _cloneDeep;
	const merge: typeof _merge;
	const omit: typeof _omit;
	const pick: typeof _pick;
}

const definePropertyAttributes: PropertyDescriptor = { configurable: false, writable: false };
Object.defineProperty(globalThis, 'cloneDeep', { ...definePropertyAttributes, value: _cloneDeep });
Object.defineProperty(globalThis, 'merge', { ...definePropertyAttributes, value: _merge });
Object.defineProperty(globalThis, 'omit', { ...definePropertyAttributes, value: _omit });
Object.defineProperty(globalThis, 'pick', { ...definePropertyAttributes, value: _pick });
