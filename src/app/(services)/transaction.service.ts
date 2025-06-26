import { UpsertTransactionFormValues } from "@/app/(resources)/(schemas)/upsert-transaction.schema";
import api from "@/app/(utils)/axios";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const transactionService = {
  getTransactions: async () => {
    const response = await api.get("/transactions");

    return response.data;
  },

  createTransaction: async (params: UpsertTransactionFormValues) => {
    const response = await api.post("/transactions/create", params);

    return response.data;
  },
};

export const CreateTransactionRequest = (
  options?: UseMutationOptions<
    UpsertTransactionFormValues,
    AxiosError,
    UpsertTransactionFormValues
  >
) => {
  return useMutation<
    UpsertTransactionFormValues,
    AxiosError,
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
