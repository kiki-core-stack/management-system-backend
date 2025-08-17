import { unflatten } from 'flat';

import {
    adminPermissionToLabelMap,
    allAdminPermissions,
} from '@/constants/admin';
import { defaultHonoFactory } from '@/core/constants/hono';
import type {
    AdminPermission,
    AdminPermissionGroup,
} from '@/generated/static/types/admin/permission';

interface TreeNode {
    children?: TreeNode[];
    label: string;
    value: string;
}

export const routePermission = 'ignore';

function convertToTreeNode(object: any, prefix: string): TreeNode {
    return {
        children: Object.entries(object).map(([key, value]) => {
            if (typeof value === 'object') return convertToTreeNode(value, `${prefix}.${key}`);
            return {
                label: adminPermissionToLabelMap[`${prefix}.${key}` as AdminPermission | AdminPermissionGroup],
                value: `${prefix}.${key}`,
            };
        }),
        label: adminPermissionToLabelMap[prefix as AdminPermission | AdminPermissionGroup],
        value: prefix,
    };
}

function sortTreeNodes(treeNodes: TreeNode[]): TreeNode[] {
    return treeNodes
        .map((treeNode) => ({
            ...treeNode,
            children: treeNode.children ? sortTreeNodes(treeNode.children) : undefined,
        }))
        .sort((a, b) => {
            const aHasChildren = a.children?.length;
            const bHasChildren = b.children?.length;
            if (aHasChildren && !bHasChildren) return 1;
            if (!aHasChildren && bHasChildren) return -1;
            return 0;
        });
}

export default defaultHonoFactory.createHandlers((ctx) => {
    const nestedPermissions: any = unflatten(
        Object.fromEntries([...allAdminPermissions].sort().map((permission) => [
            permission,
            permission,
        ])),
        { object: true },
    );

    const treeNodes = Object.entries(nestedPermissions).map(([key, value]) => convertToTreeNode(value, key));
    return ctx.createApiSuccessResponse(sortTreeNodes(treeNodes));
});
