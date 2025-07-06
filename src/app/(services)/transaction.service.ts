import { UpsertTransactionFormValues } from "@/app/(resources)/(schemas)/transaction.schema";
import api from "@/app/(utils)/axios";
import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { CustomAxiosError } from "../(types)/error";

const transactionQueryData = {
  getTransaction: "GET_TRANSACTION",
};

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

// export const GetTransactionsRequest = (
//   options?: UseQueryOptions<Transaction[], AxiosError, Transaction[]>
// ) => {
//   return useQuery<Transaction[], AxiosError, Transaction[]>({
//     queryKey: [transactionQueryData.getTransaction],
//     queryFn: transactionService.getTransactions,
//   });
// };
