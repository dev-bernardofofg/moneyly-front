import { PaginationType } from '@/app/(types)/pagination.type';
import { parseAsInteger, useQueryStates } from 'nuqs';
import { useCallback, useEffect } from 'react';

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
        limit: Math.min(Math.max(1, serverPagination.limit as number), maxLimit),
      });
    }
  }, [serverPagination, maxLimit, setPaginationParams]);

  const resetPagination = useCallback(() => {
    setPaginationParams({
      page: Math.max(1, paginationParams.page),
      limit: Math.min(Math.max(1, paginationParams.limit), maxLimit),
    });
  }, [paginationParams, maxLimit, setPaginationParams]);

  const goToPage = useCallback(
    (page: number) => {
      setPaginationParams({
        page: Math.max(1, page),
        limit: Math.min(Math.max(1, paginationParams.limit), maxLimit),
      });
    },
    [paginationParams.limit, maxLimit, setPaginationParams]
  );

  const changeLimit = useCallback(
    (limit: number) => {
      setPaginationParams({
        limit: Math.min(Math.max(1, limit), maxLimit),
        page: 1,
      });
    },
    [maxLimit, setPaginationParams]
  );

  const nextPage = useCallback(() => {
    setPaginationParams({
      page: Math.max(1, paginationParams.page + 1),
      limit: Math.min(Math.max(1, paginationParams.limit), maxLimit),
    });
  }, [paginationParams.page, paginationParams.limit, maxLimit, setPaginationParams]);

  const previousPage = useCallback(() => {
    setPaginationParams({
      page: Math.max(1, paginationParams.page - 1),
      limit: Math.min(Math.max(1, paginationParams.limit), maxLimit),
    });
  }, [paginationParams.page, paginationParams.limit, maxLimit, setPaginationParams]);

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
