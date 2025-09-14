import {
    escapeRegExp,
    isPlainObject,
} from 'es-toolkit';
import type { Context } from 'hono';
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

function normalizeApiRequestQueryFilter(filter: AnyRecord) {
    const normalizedFilter: AnyRecord = {};
    Object.entries(filter).forEach(([field, condition]) => {
        if (field.endsWith('At')) {
            normalizedFilter[field] = normalizeApiRequestQueryTypedCondition(condition, 'date');
        } else if (field.endsWith('ObjectId')) {
            normalizedFilter[field.slice(0, -8)] = normalizeApiRequestQueryTypedCondition(condition, 'objectId');
        } else normalizedFilter[field] = normalizeApiRequestQueryTypedCondition(condition);
    });

    return normalizedFilter;
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

export function parseApiRequestQueryParams(ctx: Context): ParsedApiRequestQueryParams {
    const queries = ctx.req.queries();
    const fields = queries.fields || [];
    let filter = {};
    if (queries.filter?.[0]) {
        try {
            filter = normalizeApiRequestQueryFilter(JSON.parse(queries.filter[0]));
        } catch {}
    }

    const limit = Math.min(Math.abs(Number(queries.limit?.[0]) || 10), 1000);
    const page = Math.abs(Number(queries.page?.[0]) || 1);
    const projection: Record<string, boolean> = {};
    fields.forEach((field) => {
        if (field.startsWith('-')) projection[field.slice(1)] = false;
        else projection[field] = true;
    });

    const sort: Record<string, -1 | 1> = {};
    for (const field of queries.sort?.[0]?.split(',') || []) {
        if (field.startsWith('-')) sort[field.slice(1)] = -1;
        else sort[field] = 1;
    }

    return {
        endIndex: limit * page,
        fields,
        filter,
        limit,
        page,
        projection,
        skip: (page - 1) * limit,
        sort,
    };
}

function parseTypedValue(value: any, type?: 'date' | 'objectId') {
    switch (type) {
        case 'date': {
            const date = new Date(value);
            if (!Number.isNaN(date.getTime())) return date;
            break;
        }

        case 'objectId': {
            if (Types.ObjectId.isValid(value)) return new Types.ObjectId(value);
            break;
        }
    }

    return value;
}
