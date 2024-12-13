import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import { zodOpenAPIRegistry } from '@/core/constants/zod-openapi';

export default defaultHonoFactory.createHandlers((ctx) => {
    const generator = new OpenApiGeneratorV31(zodOpenAPIRegistry.definitions);
    ctx.header('content-type', 'application/json');
    return ctx.body(
        JSON.stringify(
            generator.generateDocument({
                info: {
                    title: 'API Document',
                    version: '0.1.0',
                },
                openapi: '3.1.0',
            }),
            null,
            2,
        ),
    );
});
