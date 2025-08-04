import { PaginationType } from "@/app/(types)/pagination";
import { useCallback, useEffect, useState } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
  maxLimit?: number;
  serverPagination?: PaginationType; // Paginação que vem da API
  onPaginationChange?: (pagination: PaginationType) => void; // Callback para refazer requisição
}

export const usePagination = ({
  initialPage = 1,
  initialLimit = 10,
  maxLimit = 100,
  serverPagination,
  onPaginationChange,
}: UsePaginationProps = {}) => {
  const [pagination, setPagination] = useState<PaginationType>({
    page: Math.max(1, initialPage),
    limit: Math.min(Math.max(1, initialLimit), maxLimit),
    hasNext: false,
    hasPrevious: false,
    total: 0,
    totalPages: 0,
  });

  // Sincronizar com a paginação do servidor quando disponível
  useEffect(() => {
    if (serverPagination) {
      setPagination({
        page: Math.max(1, serverPagination.page),
        limit: Math.min(Math.max(1, serverPagination.limit), maxLimit),
        hasNext: serverPagination.hasNext,
        hasPrevious:
          (serverPagination as any).hasPrev || serverPagination.hasPrevious,
        total: serverPagination.total,
        totalPages: serverPagination.totalPages,
      });
    }
  }, [serverPagination, maxLimit]);

  const handlePaginationChange = useCallback(
    (newPagination: PaginationType) => {
      const updatedPagination = {
        page: Math.max(1, newPagination.page),
        limit: Math.min(Math.max(1, newPagination.limit), maxLimit),
        hasNext: newPagination.hasNext,
        hasPrevious: newPagination.hasPrevious,
        total: newPagination.total,
        totalPages: newPagination.totalPages,
      };

      setPagination(updatedPagination);

      // Chamar callback para refazer a requisição
      onPaginationChange?.(updatedPagination);
    },
    [maxLimit, onPaginationChange]
  );

  const resetPagination = useCallback(() => {
    setPagination({
      page: Math.max(1, initialPage),
      limit: Math.min(Math.max(1, initialLimit), maxLimit),
      hasNext: false,
      hasPrevious: false,
      total: 0,
      totalPages: 0,
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
