import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';
import { cloneDeep as _cloneDeep, merge as _merge, omit as _omit, pick as _pick } from 'lodash-es';

declare global {
	const cloneDeep: typeof _cloneDeep;
	const merge: typeof _merge;
	const omit: typeof _omit;
	const pick: typeof _pick;
}

setReadonlyConstantToGlobalThis<typeof cloneDeep>('cloneDeep', _cloneDeep);
setReadonlyConstantToGlobalThis<typeof merge>('merge', _merge);
setReadonlyConstantToGlobalThis<typeof omit>('omit', _omit);
setReadonlyConstantToGlobalThis<typeof pick>('pick', _pick);
