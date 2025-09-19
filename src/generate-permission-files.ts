import { join } from 'node:path';

import type { ManagementSystemType } from '@kiki-core-stack/pack/types';
import { capitalize } from 'es-toolkit';

import { logger } from '@/core/utils/logger';

const { writeManagementSystemPermissionTypesFile } = await import('@kiki-core-stack/pack/libs/management-system');
const baseGeneratedStaticTypesDirPath = join(
    (await import('@/core/constants/paths')).projectSrcDirPath,
    'generated/static/types',
);

const managementSystemTypes: ManagementSystemType[] = ['admin'];
await Promise.all(
    managementSystemTypes.map(async (managementSystemType) => {
        logger.info(`Generating ${managementSystemType} permission types...`);
        const module = await await import(`@/constants/${managementSystemType}`);
        const allPermissions: Set<string> = module[`all${capitalize(managementSystemType)}Permissions`];
        await writeManagementSystemPermissionTypesFile(
            managementSystemType,
            [...allPermissions],
            join(baseGeneratedStaticTypesDirPath, managementSystemType, 'permission.ts'),
        );

        logger.success(`Generated ${managementSystemType} permission types`);
    }),
);
