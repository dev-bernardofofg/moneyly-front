import { queryClient } from '@/contexts';
import { getErrorMessage } from '@/lib/errors';
import {
  getGetCategoriesQueryKey,
  useDeleteCategoriesDeleteId,
  useGetCategories,
} from '@/api/generated/hooks/categories/categories';
import { CustomAxiosError } from '@/types/error.type';
import { usePagination } from '@/hooks/use-pagination';
import { keepPreviousData } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCategoryAction = () => {
  const { paginationParams, setPaginationParams } = usePagination();
  const { data, isLoading, isFetching } = useGetCategories(
    {
      page: paginationParams.page,
      limit: paginationParams.limit,
    },
    { query: { placeholderData: keepPreviousData } }
  );

  const { mutate: deleteCategory, isPending: isDeletingCategory } = useDeleteCategoriesDeleteId({
    mutation: {
      onSuccess: () => {
        toast.success('Categoria deletada com sucesso');
        queryClient.invalidateQueries({ queryKey: getGetCategoriesQueryKey() });
      },
      onError: (error: CustomAxiosError) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      },
    },
  });

  return {
    data,
    isLoading: isLoading || isFetching,
    paginationParams,
    setPaginationParams,

    categoryActions: {
      mutate: deleteCategory,
      isPending: isDeletingCategory,
    },
  };
};
