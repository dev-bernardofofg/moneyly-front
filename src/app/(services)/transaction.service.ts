import { UpsertTransactionFormValues } from "@/app/(resources)/(schemas)/transaction.schema";
import api from "@/app/(utils)/axios";
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { CustomAxiosError } from "../(types)/error";
import {
  TransactionRequest,
  TransactionResponse,
} from "../(types)/transaction";

export const transactionQueryData = {
  getTransaction: "GET_TRANSACTION",
  deleteTransaction: "DELETE_TRANSACTION",
};

export const transactionService = {
  getTransactions: async (params: TransactionRequest) => {
    const response = await api.post("/transactions", params);

    return response.data;
  },

  createTransaction: async (params: UpsertTransactionFormValues) => {
    const response = await api.post("/transactions/create", params);

    return response.data;
  },

  deleteTransaction: async (id: string) => {
    const response = await api.delete(`/transactions/${id}`);

    return response.data;
  },
};

export const CreateTransactionRequest = (
  options?: UseMutationOptions<
    UpsertTransactionFormValues,
    CustomAxiosError,
    UpsertTransactionFormValues
  >
) => {
  return useMutation<
    UpsertTransactionFormValues,
    CustomAxiosError,
    UpsertTransactionFormValues
  >({
    mutationFn: transactionService.createTransaction,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};

export const GetTransactionsRequest = (
  params: TransactionRequest,
  options?: UseQueryOptions<
    TransactionResponse,
    CustomAxiosError,
    TransactionResponse
  >
) => {
  return useQuery<TransactionResponse, CustomAxiosError, TransactionResponse>({
    queryKey: [transactionQueryData.getTransaction, params],
    queryFn: () => transactionService.getTransactions(params),
    ...options,
  });
};

export const DeleteTransactionRequest = (
  options?: UseMutationOptions<void, CustomAxiosError, string>
) => {
  return useMutation<void, CustomAxiosError, string>({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};
