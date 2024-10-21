import { useHonoLogger } from '@kikiutils/node/hono';

import { honoApp } from '@/app';

useHonoLogger(honoApp);
