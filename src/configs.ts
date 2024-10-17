import { checkAndGetEnvValue } from '@kikiutils/node/env';

export interface Configs {
	redisUri: string;
}

export default {
	redisUri: checkAndGetEnvValue('REDIS_URI')
} satisfies Configs;
