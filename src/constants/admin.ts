import type { ReadonlyRecord } from '@kikiutils/shared/types';
import type { PopulateOptions } from 'mongoose';

import type {
    AdminPermission,
    AdminPermissionGroup,
} from '@/generated/static/types/admin/permission';

export const allAdminPermissions = new Set<string>();
export const adminPermissionToLabelMap: ReadonlyRecord<AdminPermission | AdminPermissionGroup, string> = {
    'admin': '管理員',
    'admin.create': '建立管理員',
    'admin.delete': '刪除管理員',
    'admin.list': '獲取管理員列表',
    'admin.log': '管理員日誌',
    'admin.log.list': '獲取管理員日誌列表',
    'admin.role': '管理員身分組',
    'admin.role.create': '建立管理員身分組',
    'admin.role.delete': '刪除管理員身分組',
    'admin.role.list': '獲取管理員身分組列表',
    'admin.role.update': '更新管理員身分組',
    'admin.toggle': '切換管理員狀態',
    'admin.update': '更新管理員',
    'home': '首頁',
    'home.dashboard': '首頁儀錶板',
    'home.dashboard.view': '獲取首頁儀表板資料',
};

export const populateCreatedAndEditedByAdminOptions: PopulateOptions[] = [
    {
        path: 'createdByAdmin',
        select: [
            '-_id',
            'account',
        ],
    },
    {
        path: 'editedByAdmin',
        select: [
            '-_id',
            'account',
        ],
    },
];
