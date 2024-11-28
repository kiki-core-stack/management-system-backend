import { useHonoLogger } from '@kikiutils/node/hono';

import { honoApp } from '@/core/app';

useHonoLogger(honoApp);
