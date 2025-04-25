await Promise.all([
    import('./production-loader-generators/middlewares'),
    import('./production-loader-generators/routes'),
]);
