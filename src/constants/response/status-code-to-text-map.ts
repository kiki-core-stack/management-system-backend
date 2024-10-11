import type { StatusCode } from 'hono/utils/http-status';
import { mapValues } from 'lodash-es';

import { statusCodeToMessageMap } from './';

export const statusCodeToResponseTextMap = Object.freeze<Partial<Record<StatusCode, string>>>(mapValues(statusCodeToMessageMap, (_, code: StatusCode) => new ApiError(code).message));
