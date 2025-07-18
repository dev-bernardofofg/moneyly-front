import { Pagination } from "@/app/(types)/pagination";
import { useCallback, useState } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
  maxLimit?: number;
}

export const usePagination = ({
  initialPage = 1,
  initialLimit = 10,
  maxLimit = 100,
}: UsePaginationProps = {}) => {
  const [pagination, setPagination] = useState<Pagination>({
    page: Math.max(1, initialPage),
    limit: Math.min(Math.max(1, initialLimit), maxLimit),
  });

  const handlePaginationChange = useCallback(
    (newPagination: Pagination) => {
      setPagination({
        page: Math.max(1, newPagination.page),
        limit: Math.min(Math.max(1, newPagination.limit), maxLimit),
      });
    },
    [maxLimit]
  );

  const resetPagination = useCallback(() => {
    setPagination({
      page: Math.max(1, initialPage),
      limit: Math.min(Math.max(1, initialLimit), maxLimit),
    });
  }, [initialPage, initialLimit, maxLimit]);

  const goToPage = useCallback((page: number) => {
    setPagination((prev) => ({
      ...prev,
      page: Math.max(1, page),
    }));
  }, []);

  const changeLimit = useCallback(
    (limit: number) => {
      setPagination((prev) => ({
        ...prev,
        limit: Math.min(Math.max(1, limit), maxLimit),
        page: 1, // Reset to page 1 when changing limit
      }));
    },
    [maxLimit]
  );

  const nextPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  }, []);

  const previousPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, page: Math.max(1, prev.page - 1) }));
  }, []);

  return {
    pagination,
    setPagination,
    handlePaginationChange,
    resetPagination,
    goToPage,
    changeLimit,
    nextPage,
    previousPage,
  };
};
