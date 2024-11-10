interface PaginationResult {
  total: number;
  totalPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginatedResponse<T> {
  pagination: PaginationResult;
  data: T[];
}
