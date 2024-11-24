import { zodOpenAPIRegistry } from '@/core/constants/zod-openapi';

zodOpenAPIRegistry.register('defaultAPISuccessResponseContent', z.object({
    data: z.object({}).optional(),
    message: z.string().describe('成功'),
    success: z.literal(true),
}));

zodOpenAPIRegistry.registerComponent('responses', 'defaultAPISuccess', {
    content: { 'application/json': { schema: { $ref: '#/components/schemas/defaultAPISuccessResponseContent' } } },
    description: '成功',
});
