// @ts-expect-error Ignore this error.
import _micromatch from '@kikiutils/micromatch';
import type * as micromatchType from 'micromatch';

export const micromatch = _micromatch as unknown as typeof micromatchType;
