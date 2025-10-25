import { PaginatedResponse } from "@app/types/others";

export const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'data',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator',
};

export const defaultPaginationConfig = {
    page: 1,
    limit: 10
}

export function buildPaginatedResponse<T>(
    data: T[],
    totalDocs: number,
    page: number,
    limit: number
): PaginatedResponse<T> {
    const pageCount = Math.ceil(totalDocs / limit) || 1;

    return {
        data,
        paginator: {
            itemCount: totalDocs,
            perPage: limit,
            pageCount,
            currentPage: page,
            slNo: (page - 1) * limit + 1,
            hasPrevPage: page > 1,
            hasNextPage: page < pageCount,
            prev: page > 1 ? page - 1 : null,
            next: page < pageCount ? page + 1 : null,
        },
    };
}
