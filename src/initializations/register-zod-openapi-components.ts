import { zodOpenAPIRegistry } from '@/core/constants/zod-openapi';

zodOpenAPIRegistry.registerComponent('responses', 'defaultAPISuccess', {
    content: {
        'application/json': {
            schema: zodSchemaToOpenAPISchema(z.object({
                data: z.object({}).optional(),
                message: z.string().describe('成功'),
                success: z.literal(true),
            })),
        },
    },
    description: '成功',
});
