import { checkAndGetEnvValue } from '@kikiutils/node/env';
import type { OpenAPIObject } from 'openapi3-ts/oas31';
import type { ReadonlyDeep } from 'type-fest';

export type Configs = ReadonlyDeep<{
	openAPI: Omit<OpenAPIObject, 'components' | 'paths' | 'webhooks'>;
	redisUri: string;
}>;

export const configs: Configs = {
	openAPI: {
		info: { title: 'API Document', version: '0.1.0' },
		openapi: '3.1.0'
	},
	redisUri: checkAndGetEnvValue('REDIS_URI')
};

export default configs;
