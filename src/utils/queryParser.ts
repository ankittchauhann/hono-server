import type { FilterQuery, QueryOptions, Schema } from "mongoose";

export interface QueryParams {
    [key: string]: string | undefined;
    sort?: string;
    page?: string;
    limit?: string;
    fields?: string;
    currentPage?: string;
}

interface BuildQueryResult<T> {
    query: FilterQuery<T>;
    options: QueryOptions;
    pagination: {
        skip: number;
        limit: number;
        page: number;
    };
}

type ValidKeys<T> = keyof T;

class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

function buildQuery<T>(
    queryParams: QueryParams,
    validKeys: ValidKeys<T>[]
): BuildQueryResult<T> {
    const { sort, page, limit, fields, currentPage, ...filters } = queryParams;

    // Use currentPage if provided, otherwise use page
    const pageParam = currentPage || page;

    // Initialize query object
    const query: FilterQuery<T> = {};

    // Parse and build query filters
    for (const [key, value] of Object.entries(filters)) {
        // Skip pagination and utility parameters
        if (["sort", "page", "limit", "fields", "currentPage"].includes(key)) {
            continue;
        }

        // Handle MongoDB operator syntax: field[operator]=value
        const operatorMatch = key.match(/^(.+)\[(\w+)\]$/);

        if (operatorMatch) {
            const [, fieldName, operator] = operatorMatch;

            if (!validKeys.includes(fieldName as ValidKeys<T>)) {
                throw new BadRequestError(`Invalid query field: ${fieldName}`);
            }

            // Initialize field query if it doesn't exist
            if (!(query as Record<string, unknown>)[fieldName]) {
                (query as Record<string, unknown>)[fieldName] = {};
            }

            // Handle different operators
            switch (operator) {
                case "regex":
                    if (typeof value === "string") {
                        query[fieldName].$regex = new RegExp(value, "i");
                    }
                    break;
                case "in":
                    if (typeof value === "string") {
                        query[fieldName].$in = value.split(",");
                    }
                    break;
                case "nin":
                    if (typeof value === "string") {
                        query[fieldName].$nin = value.split(",");
                    }
                    break;
                case "gte":
                case "gt":
                case "lte":
                case "lt":
                case "ne": {
                    // Convert numeric strings to numbers for comparison operators
                    const numValue = Number(value);
                    query[fieldName][`$${operator}`] = Number.isNaN(numValue)
                        ? value
                        : numValue;
                    break;
                }
                default:
                    throw new BadRequestError(
                        `Unsupported operator: ${operator}`
                    );
            }
        } else {
            // Standard field filtering
            if (!validKeys.includes(key as ValidKeys<T>)) {
                throw new BadRequestError(`Invalid query parameter: ${key}`);
            }

            if (key.includes(".")) {
                // Nested Object Filtering (e.g., 'address.city=New York')
                (query as Record<string, unknown>)[key] = value;
            } else if (
                typeof value === "string" &&
                value.startsWith("/") &&
                value.endsWith("/")
            ) {
                // Regex Filtering (e.g., 'type=/tugger/i')
                (query as Record<string, unknown>)[key] = {
                    $regex: new RegExp(value.slice(1, -1), "i"),
                };
            } else {
                // Basic Filtering with multiple values support
                if (typeof value === "string" && value.includes(",")) {
                    (query as Record<string, unknown>)[key] = {
                        $in: value.split(","),
                    };
                } else {
                    (query as Record<string, unknown>)[key] = value;
                }
            }
        }
    }

    // Sorting
    let sortOptions: string | undefined;
    if (sort) {
        sortOptions = sort.split(",").join(" ");
    }

    // Pagination
    const pageNumber = Number.parseInt(pageParam || "1", 10);
    const limitNumber = Number.parseInt(limit || "10", 10);
    const skip = (pageNumber - 1) * limitNumber;

    // Field Selection
    let fieldSelection: string | undefined;
    if (fields) {
        fieldSelection = fields.split(",").join(" ");
    }

    return {
        query,
        options: {
            sort: sortOptions,
            select: fieldSelection,
        },
        pagination: {
            skip,
            limit: limitNumber,
            page: pageNumber,
        },
    };
}

export function getValidKeys<T>(schema: Schema<T>): (keyof T)[] {
    return Object.keys(schema.paths) as (keyof T)[];
}

export { buildQuery, BadRequestError };
export default buildQuery;
