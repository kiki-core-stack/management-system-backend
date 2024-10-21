import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';

declare global {
	const apiZValidator: typeof zValidator;
}

setReadonlyConstantToGlobalThis('apiZValidator', (target: any, schema: any) => {
	return zValidator(target, schema, (result) => {
		if (!result.success) throw result.error;
	});
});
