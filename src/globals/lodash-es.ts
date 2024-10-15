import { cloneDeep as _cloneDeep, merge as _merge, omit as _omit, pick as _pick } from 'lodash-es';

declare global {
	var cloneDeep: typeof _cloneDeep;
	var merge: typeof _merge;
	var omit: typeof _omit;
	var pick: typeof _pick;
}

globalThis.cloneDeep = _cloneDeep;
globalThis.merge = _merge;
globalThis.omit = _omit;
globalThis.pick = _pick;
