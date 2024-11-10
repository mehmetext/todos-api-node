import { API } from "../constants";

export function getPaginationSkip(page: number = 1): number {
  return (page - 1) * API.PAGINATION.DEFAULT_PAGE_SIZE;
}

export function calculatePagination(
  total: number,
  page: number = 1
): PaginationResult {
  const pageSize = API.PAGINATION.DEFAULT_PAGE_SIZE;
  const skip = getPaginationSkip(page);

  return {
    total,
    totalPage: Math.ceil(total / pageSize),
    hasNext: skip + pageSize < total,
    hasPrev: skip > 0,
  };
}
