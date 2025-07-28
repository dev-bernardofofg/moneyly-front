import {
  Category,
  CategoryResponse,
  CreateCategoryParams,
  UpdateCategoryParams,
} from "@/app/(types)/category";
import { CustomAxiosError } from "@/app/(types)/error";
import api from "@/app/(utils)/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { PaginationType } from "../(types)/pagination";

export const categoryQueryData = {
  getCategories: "GET_CATEGORIES",
};

export const categoryService = {
  createCategory: async (data: CreateCategoryParams) => {
    const response = await api.post("/categories/create", data);

    return response.data;
  },

  getCategories: async (params?: PaginationType) => {
    const response = await api.post("/categories", params);

    return response.data;
  },

  updateCategory: async (data: UpdateCategoryParams) => {
    const response = await api.put(`/categories/update/${data.id}`, data);

    return response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await api.delete(`/categories/delete/${id}`);

    return response.data;
  },
};

export const CreateCategoryRequest = (
  options?: UseMutationOptions<Category, CustomAxiosError, CreateCategoryParams>
) => {
  return useMutation<Category, CustomAxiosError, CreateCategoryParams>({
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
  params?: PaginationType,
  options?: UseQueryOptions<
    CategoryResponse,
    CustomAxiosError,
    CategoryResponse
  >
) => {
  return useQuery<CategoryResponse, CustomAxiosError, CategoryResponse>({
    queryKey: [categoryQueryData.getCategories, params],
    queryFn: () => categoryService.getCategories(params),
    staleTime: Infinity,
    ...options,
  });
};

export const UpdateCategoryRequest = (
  options?: UseMutationOptions<Category, CustomAxiosError, UpdateCategoryParams>
) => {
  return useMutation<Category, CustomAxiosError, UpdateCategoryParams>({
    mutationFn: categoryService.updateCategory,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};

export const DeleteCategoryRequest = (
  options?: UseMutationOptions<Category, CustomAxiosError, string>
) => {
  return useMutation<Category, CustomAxiosError, string>({
    mutationFn: categoryService.deleteCategory,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};
