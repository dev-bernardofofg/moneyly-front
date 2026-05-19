import { PaginationType } from "@/app/(types)/pagination.type";
import { parseAsInteger, useQueryStates } from "nuqs";
import { useCallback, useEffect, useState } from "react";

interface UsePaginationProps {
  initialPage?: number;
  initialLimit?: number;
  maxLimit?: number;
  serverPagination?: Partial<PaginationType>; // Paginação que vem da API
}

export const usePagination = ({
  initialPage = 1,
  initialLimit = 10,
  maxLimit = 100,
  serverPagination,
}: UsePaginationProps = {}) => {
  const [paginationParams, setPaginationParams] = useQueryStates({
    page: parseAsInteger.withDefault(initialPage),
    limit: parseAsInteger.withDefault(initialLimit),
  });

  // Sincronizar com a paginação do servidor quando disponível
  useEffect(() => {
    if (serverPagination) {
      setPaginationParams({
        page: Math.max(1, serverPagination.page as number),
        limit: Math.min(
          Math.max(1, serverPagination.limit as number),
          maxLimit
        ),
      });
    }
  }, [serverPagination, maxLimit]);
    

  const resetPagination = useCallback(() => {
    setPaginationParams({
      page: Math.max(1, paginationParams.page),
      limit: Math.min(Math.max(1, paginationParams.limit), maxLimit),
    });
  }, [paginationParams, maxLimit]);

  const goToPage = useCallback((page: number) => {
    setPaginationParams({
      page: Math.max(1, page),
      limit: Math.min(Math.max(1, paginationParams.limit), maxLimit),
    });
  }, []);

  const changeLimit = useCallback(
    (limit: number) => {
      setPaginationParams({
        limit: Math.min(Math.max(1, limit), maxLimit),
        page: 1,
      });
    },
    [maxLimit]
  );

  const nextPage = useCallback(() => {
    setPaginationParams({
      page: Math.max(1, paginationParams.page + 1),
      limit: Math.min(Math.max(1, paginationParams.limit), maxLimit),
    });
  }, []);

  const previousPage = useCallback(() => {
    setPaginationParams({
      page: Math.max(1, paginationParams.page - 1),
      limit: Math.min(Math.max(1, paginationParams.limit), maxLimit),
    });
  }, []);

  return {
    paginationParams,
    setPaginationParams,
    resetPagination,
    goToPage,
    changeLimit,
    nextPage,
    previousPage,
  };
};
