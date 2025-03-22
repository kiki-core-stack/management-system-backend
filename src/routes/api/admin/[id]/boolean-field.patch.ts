import { AdminModel } from '@kiki-core-stack/pack/models/admin';

export default defaultHonoFactory.createHandlers(async (ctx) => {
    await getModelDocumentByRouteIdAndUpdateBooleanField(
        ctx,
        AdminModel,
        ['enabled'],
        null,
        (admin, field) => {
            if (field === 'enabled' && admin.id === ctx.admin!.id) throwApiError(400, '無法變更自己的啟用狀態！');
        },
    );

    return ctx.createApiSuccessResponse();
});
