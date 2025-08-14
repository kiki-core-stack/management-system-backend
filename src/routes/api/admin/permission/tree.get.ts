import { unflatten } from 'flat';

import { allAdminPermissions } from '@/constants/admin';
import { defaultHonoFactory } from '@/core/constants/hono';
import { defineRouteHandlerOptions } from '@/core/libs/route';

interface TreeNode {
    children?: TreeNode[];
    label: null;
    value: string;
}

function convertToTreeNode(object: any, prefix: string): TreeNode {
    return {
        children: Object.entries(object).map(([key, value]) => {
            if (typeof value === 'object') return convertToTreeNode(value, `${prefix}.${key}`);
            return {
                label: null,
                value: `${prefix}.${key}`,
            };
        }),
        label: null,
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

export const routeHandlerOptions = defineRouteHandlerOptions({ properties: { permission: 'ignore' } });

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
