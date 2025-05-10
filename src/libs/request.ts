import type { Context } from 'hono';
import {
    escapeRegExp,
    isPlainObject,
} from 'lodash-es';
import { Types } from 'mongoose';

const isValidRegexFlags = (flags: string) => /^[gimsuy]*$/.test(flags);

function isValidRegexPattern(pattern: string) {
    try {
        // eslint-disable-next-line no-new
        new RegExp(pattern);
        return true;
    } catch {
        return false;
    }
}

function normalizeApiRequestQueryTypedCondition(condition: any, type?: 'date' | 'objectId') {
    if (!isPlainObject(condition)) return parseTypedValue(condition, type);
    const normalizedCondition: AnyRecord = {};
    if (condition.$eq !== undefined) normalizedCondition.$eq = parseTypedValue(condition.$eq, type);
    if (condition.$gte !== undefined) normalizedCondition.$gte = parseTypedValue(condition.$gte, type);
    if (condition.$gt !== undefined) normalizedCondition.$gt = parseTypedValue(condition.$gt, type);
    if (condition.$lt !== undefined) normalizedCondition.$lt = parseTypedValue(condition.$lt, type);
    if (condition.$lte !== undefined) normalizedCondition.$lte = parseTypedValue(condition.$lte, type);
    if (Array.isArray(condition.$in)) {
        normalizedCondition.$in = condition
            .$in
            .map((value: any) => parseTypedValue(value, type))
            .filter((value: any) => value !== undefined);
    }

    if (typeof condition.$regex === 'string') {
        normalizedCondition.$regex = isValidRegexPattern(condition.$regex)
            ? condition.$regex
            : escapeRegExp(condition.$regex);

        if (typeof condition.$options === 'string' && isValidRegexFlags(condition.$options)) {
            normalizedCondition.$options = condition.$options;
        }
    }

    return normalizedCondition;
}

function normalizeApiRequestQueryFilters(filters: AnyRecord) {
    const normalizedFilters: AnyRecord = {};
    Object.entries(filters).forEach(([field, condition]) => {
        if (field.endsWith('At')) {
            normalizedFilters[field] = normalizeApiRequestQueryTypedCondition(condition, 'date');
        } else if (field.endsWith('ObjectId')) {
            normalizedFilters[field.slice(0, -8)] = normalizeApiRequestQueryTypedCondition(condition, 'objectId');
        } else normalizedFilters[field] = normalizeApiRequestQueryTypedCondition(condition);
    });

    return normalizedFilters;
}

export function parseApiRequestQueryParams(ctx: Context): ParsedApiRequestQueryParams {
    const queries = ctx.req.queries();
    let filters = {};
    if (queries.filters?.[0]) {
        try {
            filters = normalizeApiRequestQueryFilters(JSON.parse(queries.filters[0]));
        } catch {}
    }

    const limit = Math.min(Math.abs(Number(queries.limit?.[0]) || 10), 1000);
    const page = Math.abs(Number(queries.page?.[0]) || 1);
    return {
        endIndex: limit * page,
        fields: queries.fields || [],
        filters,
        limit,
        page,
        skip: (page - 1) * limit,
    };
}

function parseTypedValue(value: any, type?: 'date' | 'objectId') {
    if (type === 'date') {
        const date = new Date(value);
        if (!Number.isNaN(date.getTime())) return date;
    } else if (type === 'objectId') {
        if (typeof value === 'string' && Types.ObjectId.isValid(value)) return new Types.ObjectId(value);
    }

    return value;
}
