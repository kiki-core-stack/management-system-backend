import { setReadonlyConstantToGlobalThis } from '@kikiutils/node';

declare global {
    const populateCreatedAndEditedByAdminOptions: typeof _populateCreatedAndEditedByAdminOptions;
}

const _populateCreatedAndEditedByAdminOptions = [
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

setReadonlyConstantToGlobalThis<typeof populateCreatedAndEditedByAdminOptions>(
    'populateCreatedAndEditedByAdminOptions',
    _populateCreatedAndEditedByAdminOptions,
);
