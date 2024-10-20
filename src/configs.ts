import { checkAndGetEnvValue } from '@kikiutils/node/env';
import type { ReadonlyDeep } from 'type-fest';

export type Configs = ReadonlyDeep<{
	redisUri: string;
}>;

export const configs: Configs = {
	redisUri: checkAndGetEnvValue('REDIS_URI')
};

export default configs;
