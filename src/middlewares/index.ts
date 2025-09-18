// Control the middleware registration condition and order here

if (process.env.NODE_ENV === 'development') await import('./core/logger');
await import('./core/route');
await import('./security/replay-protection');

await import('./context/session');

await import('./core/api');
