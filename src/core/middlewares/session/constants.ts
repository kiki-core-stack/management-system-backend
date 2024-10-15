import { checkAndGetEnvValue } from '@kikiutils/node/env';
import { createStorage, prefixStorage } from 'unstorage';
import redisDriver from 'unstorage/drivers/redis';

export const sessionClearedSymbol = Symbol();
export const sessionStorage = prefixStorage(createStorage({ driver: redisDriver({ url: checkAndGetEnvValue('REDIS_URI') }) }), 'session');
export const sessionTokenSymbol = Symbol();
