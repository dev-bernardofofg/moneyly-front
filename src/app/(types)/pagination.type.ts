export type PaginationType = {
  hasNext?: boolean;
  hasPrevious?: boolean;
  limit: number;
  page: number;
  total?: number;
  totalPages?: number;
};
