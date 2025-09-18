// Control the middleware registration condition and order here
if (process.env.NODE_ENV === 'development') await import('./logger');
await import('./route');
await import('./replay-protection');
await import('./session');
await import('./admin');
await import('./admin-permission');
await import('./api');
