import { configs } from '@/configs';
import { honoApp } from '@/core/app';
import { session } from '@/libs/middlewares/session';
import { cookieSessionTokenHandler } from '@/libs/middlewares/session/handlers/token';

honoApp.use('/api/*', session(configs.sessionCipherKey, cookieSessionTokenHandler));
