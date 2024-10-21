import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import { cloneDeep as _cloneDeep, merge as _merge, omit as _omit, pick as _pick } from 'lodash-es';

declare global {
	const cloneDeep: typeof _cloneDeep;
	const merge: typeof _merge;
	const omit: typeof _omit;
	const pick: typeof _pick;
}

setReadonlyConstantToGlobalThis('cloneDeep', _cloneDeep);
setReadonlyConstantToGlobalThis('merge', _merge);
setReadonlyConstantToGlobalThis('omit', _omit);
setReadonlyConstantToGlobalThis('pick', _pick);
