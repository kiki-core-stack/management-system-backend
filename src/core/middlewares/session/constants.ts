import { createStorage, prefixStorage } from 'unstorage';
import redisDriver from 'unstorage/drivers/redis';

import configs from '@/configs';

export const sessionStorage = prefixStorage(createStorage({ driver: redisDriver({ url: configs.redisUri }) }), 'session');
