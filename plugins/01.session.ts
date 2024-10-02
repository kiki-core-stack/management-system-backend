import nitroSession from '@kikiutils/nitro-session';

// @ts-expect-error
export default defineNitroPlugin((nitroApp) => nitroSession(nitroApp, useRuntimeConfig().nitroSession));
