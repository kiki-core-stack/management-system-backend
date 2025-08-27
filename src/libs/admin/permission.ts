import { AdminModel } from '@kiki-core-stack/pack/models/admin';
import type { AdminRoleDocument } from '@kiki-core-stack/pack/models/admin/role';
import { enhancedRedisStorage } from '@kiki-core-stack/pack/storages/enhanced/redis';
import * as enhancedRedisStore from '@kiki-core-stack/pack/stores/enhanced/redis';
import { toObjectIdHexString } from '@kikiutils/mongoose/utils';
import type { Types } from 'mongoose';

export async function clearAllAdminPermissionCache() {
    const keys = await enhancedRedisStorage.instance.keys('adminPermission:*');
    await enhancedRedisStorage.instance.del(keys);
}

export async function getAdminPermission(adminId: string | Types.ObjectId) {
    let adminPermission = await enhancedRedisStore.adminPermission.getItem(toObjectIdHexString(adminId));
    if (!adminPermission) {
        const admin = await AdminModel
            .findById(adminId)
            .select([
                '-_id',
                'isSuperAdmin',
                'roles',
            ]);

        if (!admin) throw new Error('Admin not found');
        if (admin?.isSuperAdmin) {
            adminPermission = {
                isSuperAdmin: true,
                permissions: [],
            };
        } else {
            const populatedAdmin = await admin.populate<{ roles: AdminRoleDocument[] }>(
                'roles',
                [
                    '-_id',
                    'permissions',
                ],
            );

            adminPermission = {
                isSuperAdmin: false,
                permissions: [...new Set(populatedAdmin.roles.map((role) => role.permissions).flat())],
            };
        }

        await enhancedRedisStore.adminPermission.setItem(adminPermission, toObjectIdHexString(adminId));
    }

    return adminPermission;
}
