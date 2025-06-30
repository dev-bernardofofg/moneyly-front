import { CreateCategoryFormValues } from "@/app/(resources)/(schemas)/category.schema";
import { Category } from "@/app/(types)/category";
import api from "@/app/(utils)/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

export const categoryQueryData = {
  getCategories: "GET_CATEGORIES",
};

export const categoryService = {
  createCategory: async (data: CreateCategoryFormValues) => {
    const response = await api.post("/categories/create", data);

    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/categories");

    return response.data;
  },
};

export const CreateCategoryRequest = (
  options?: UseMutationOptions<
    CreateCategoryFormValues,
    AxiosError,
    CreateCategoryFormValues
  >
) => {
  return useMutation<
    CreateCategoryFormValues,
    AxiosError,
    CreateCategoryFormValues
  >({
    mutationFn: categoryService.createCategory,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};

export const GetCategoriesRequest = (
  options?: UseQueryOptions<Category[], AxiosError, Category[]>
) => {
  return useQuery<Category[], AxiosError, Category[]>({
    queryKey: [categoryQueryData.getCategories],
    queryFn: categoryService.getCategories,
    staleTime: Infinity,
    ...options,
  });
};
