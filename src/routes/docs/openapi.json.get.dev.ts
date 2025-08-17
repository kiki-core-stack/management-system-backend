import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import { defaultHonoFactory } from '@/core/constants/hono';
import { zodOpenApiRegistry } from '@/core/constants/zod-openapi';

export const routePermission = 'ignore';

export default defaultHonoFactory.createHandlers((ctx) => {
    const definitions = zodOpenApiRegistry.definitions.toSorted((a, b) => {
        const isARoute = a.type === 'route';
        const isBRoute = b.type === 'route';
        if (isARoute && isBRoute) {
            const tagA = a.route.tags?.toSorted()[0];
            const tagB = b.route.tags?.toSorted()[0];
            if (tagA && tagB) return tagA.localeCompare(tagB);
            if (!tagA && tagB) return -1;
            if (tagA && !tagB) return 1;
            return 0;
        }

        if (isARoute) return -1;
        if (isBRoute) return 1;
        return 0;
    });

    const generator = new OpenApiGeneratorV31(definitions);
    ctx.header('content-type', 'application/json');
    return ctx.body(
        JSON.stringify(
            generator.generateDocument({
                info: {
                    title: 'API Document',
                    version: '0.1.0',
                },
                openapi: '3.1.1',
            }),
            null,
            2,
        ),
    );
});
