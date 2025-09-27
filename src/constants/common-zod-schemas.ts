import * as z from '@kiki-core-stack/pack/libs/zod';
import { FileModel } from '@kiki-core-stack/pack/models/file';

export const fileId = z.objectId().refine((_id) => FileModel.exists({ _id }));
