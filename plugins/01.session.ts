import nitroSession from '@kikiutils/nitro-session';

export default defineNitroPlugin((nitroApp) => nitroSession(nitroApp, useRuntimeConfig().nitroSession));
