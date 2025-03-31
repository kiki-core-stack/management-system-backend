import type { PopulateOptions } from 'mongoose';

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
