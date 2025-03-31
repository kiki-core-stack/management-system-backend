import { OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import configs from '@/configs';
import { defaultHonoFactory } from '@/core/constants/hono';
import { zodOpenApiRegistry } from '@/core/constants/zod-openapi';

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
    const document = generator.generateDocument(configs.openApi as Parameters<typeof generator.generateDocument>[0]);
    return ctx.body(JSON.stringify(document, null, 2), 200, { 'Content-Type': 'application/json' });
});
