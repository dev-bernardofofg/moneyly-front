import { ErrorResponse } from "@/app/(helpers)/errors";
import {
  Category,
  CreateCategoryParams,
  UpdateCategoryParams,
} from "@/app/(types)/category";
import api from "@/app/(utils)/axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

export const categoryQueryData = {
  getCategories: "GET_CATEGORIES",
};

export const categoryService = {
  createCategory: async (data: CreateCategoryParams) => {
    const response = await api.post("/categories/create", data);

    return response.data;
  },

  getCategories: async () => {
    const response = await api.get("/categories");

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
  options?: UseMutationOptions<Category, ErrorResponse, CreateCategoryParams>
) => {
  return useMutation<Category, ErrorResponse, CreateCategoryParams>({
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
  options?: UseQueryOptions<Category[], ErrorResponse, Category[]>
) => {
  return useQuery<Category[], ErrorResponse, Category[]>({
    queryKey: [categoryQueryData.getCategories],
    queryFn: categoryService.getCategories,
    staleTime: Infinity,
    ...options,
  });
};

export const UpdateCategoryRequest = (
  options?: UseMutationOptions<Category, ErrorResponse, UpdateCategoryParams>
) => {
  return useMutation<Category, ErrorResponse, UpdateCategoryParams>({
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
  options?: UseMutationOptions<Category, ErrorResponse, string>
) => {
  return useMutation<Category, ErrorResponse, string>({
    mutationFn: categoryService.deleteCategory,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};
