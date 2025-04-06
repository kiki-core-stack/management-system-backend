import type { Context } from 'hono';
import {
    escapeRegExp,
    merge,
    omit,
} from 'lodash-es';
import { Types } from 'mongoose';

const baseFilterInFields = {
    states: 'state',
    types: 'type',
} as const;

const convertToObjectIdArray = (array: any[]) => array.map((item) => convertToObjectIdIfValid(item));

function convertToObjectIdIfValid(value: any) {
    return typeof value === 'string' && Types.ObjectId.isValid(value) ? new Types.ObjectId(value) : value;
}

export function getProcessedApiRequestQueries(
    ctx: Context,
    filterInFields?: Dict<string>,
    processObjectIdIgnoreFields?: string[],
): ProcessedApiRequestQueries {
    const filter: Dict<any> = {};
    const queries: {
        fields?: string;
        filter?: string;
        limit?: string;
        page?: string;
    } = ctx.req.query();

    // TODO: 重構與資料驗證並移除不該出現的搜尋條件
    if (queries.filter) {
        let filterData = JSON.parse(queries.filter);
        if (filterData.endAt) merge(filter, { createdAt: { $lt: new Date(filterData.endAt) } });
        if (filterData.startAt) merge(filter, { createdAt: { $gte: new Date(filterData.startAt) } });
        // eslint-disable-next-line style/array-bracket-newline, style/array-element-newline
        Object.entries(filterData = omit(filterData, 'endAt', 'startAt')).forEach(([key, value]) => {
            if (key.endsWith('Id') && !processObjectIdIgnoreFields?.includes(key) && delete filterData[key]) {
                filter[key.slice(0, -2)] = convertToObjectIdIfValid(value);
            }

            if (
                key.endsWith('Ids')
                && !filterInFields?.[key]
                && delete filterData[key]
                && Array.isArray(value) && value.length
            ) merge(filter, { [key.slice(0, -3)]: { $in: convertToObjectIdArray(value) } });

            if (value?.$regex !== undefined && delete filterData[key] && value.$regex) {
                filter[key] = (value.$regex = processRegexString(value.$regex), value);
            }

            // eslint-disable-next-line style/max-len
            // eslint-disable-next-line style/array-bracket-newline, style/array-element-newline, style/object-curly-newline
            Object.entries({ ...baseFilterInFields, ...filterInFields }).forEach(([toCheckField, filterField]) => {
                if (
                    key === toCheckField
                    && delete filterData[toCheckField]
                    && Array.isArray(value)
                    && value.length
                ) merge(filter, { [filterField]: { $in: convertToObjectIdArray(value) } });
            });
        });

        merge(filter, filterData);
    }

    const limit = Math.min(Math.abs(Number(queries.limit) || 10), 1000);
    const page = Math.abs(Number(queries.page) || 1);
    const offset = limit * page;
    return {
        fields: (() => {
            try {
                const fields = JSON.parse(queries.fields || '[]');
                return Array.isArray(fields) ? fields : [];
            } catch {
                return [];
            }
        })(),
        filter,
        limit,
        offset,
        page,
        skip: (page - 1) * limit,
    };
}

function processRegexString(value: string) {
    try {
        // eslint-disable-next-line unicorn/new-for-builtins
        RegExp(value);
        return value;
    } catch {
        return escapeRegExp(value);
    }
}
