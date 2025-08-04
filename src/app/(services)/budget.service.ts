import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import {
  CreateBudgetRequest,
  GetBudgetsResponse,
  UpdateBudgetRequest,
  UpsertBudgetResponse,
} from "../(types)/budget";
import { CustomAxiosError } from "../(types)/error";
import api from "../(utils)/axios";

export const budgetQueryData = {
  getBudgets: "getBudgets",
} as const;

export const budgetService = {
  create: async (data: CreateBudgetRequest) => {
    const response = await api.post("/category-budgets", data);
    return response.data;
  },
  update: async (data: UpdateBudgetRequest) => {
    const response = await api.put(`/category-budgets/${data.id}`, {
      monthlyLimit: data.monthlyLimit,
    });
    return response.data;
  },
  get: async (params?: { periodId?: string }) => {
    const response = await api.post("/category-budgets", params);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/category-budgets/${id}`);
    return response.data;
  },
};

export const CreateBudget = (
  options?: UseMutationOptions<
    UpsertBudgetResponse,
    CustomAxiosError,
    CreateBudgetRequest
  >
) => {
  return useMutation<
    UpsertBudgetResponse,
    CustomAxiosError,
    CreateBudgetRequest
  >({
    mutationFn: budgetService.create,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};

export const UpdateBudget = (
  options?: UseMutationOptions<
    UpsertBudgetResponse,
    CustomAxiosError,
    UpdateBudgetRequest
  >
) => {
  return useMutation<
    UpsertBudgetResponse,
    CustomAxiosError,
    UpdateBudgetRequest
  >({
    mutationFn: (data: UpdateBudgetRequest) => budgetService.update(data),
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};

export const GetBudgets = (
  params?: { periodId?: string },
  options?: UseQueryOptions<
    GetBudgetsResponse,
    CustomAxiosError,
    GetBudgetsResponse
  >
) => {
  return useQuery<GetBudgetsResponse, CustomAxiosError, GetBudgetsResponse>({
    queryKey: [budgetQueryData.getBudgets, params],
    queryFn: () => budgetService.get(params),
    ...options,
  });
};

export const DeleteBudget = (
  options?: UseMutationOptions<UpsertBudgetResponse, CustomAxiosError, string>
) => {
  return useMutation<UpsertBudgetResponse, CustomAxiosError, string>({
    mutationFn: budgetService.delete,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};
