import { logger as honoLogger } from 'hono/logger';

import { honoApp } from '@/core/app';
import { logger } from '@/core/utils/logger';

honoApp.use(honoLogger((text) => text[0] !== '<' && logger.info(text.substring(4))));
