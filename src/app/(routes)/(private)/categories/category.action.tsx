import { queryClient } from '@/app/(contexts)';
import { getErrorMessage } from '@/app/(helpers)/errors';
import {
  getGetCategoriesQueryKey,
  useDeleteCategoriesDeleteId,
  useGetCategories,
} from '@/app/(resources)/(generated)/hooks/categories/categories';
import { CustomAxiosError } from '@/app/(types)/error.type';
import { usePagination } from '@/hooks/use-pagination';
import { toast } from 'sonner';

export const useCategoryAction = () => {
  const { paginationParams, setPaginationParams } = usePagination();
  const { data, isLoading } = useGetCategories({
    page: paginationParams.page,
    limit: paginationParams.limit,
  });

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
    isLoading,
    paginationParams,
    setPaginationParams,

    categoryActions: {
      mutate: deleteCategory,
      isPending: isDeletingCategory,
    },
  };
};
