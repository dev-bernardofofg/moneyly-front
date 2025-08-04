import {
  AddValueToGoalRequest,
  AddValueToGoalResponse,
  GetGoalsResponse,
  UpsertGoalRequest,
  UpsertGoalResponse,
} from "@/app/(types)/goal.type";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { CustomAxiosError } from "../(types)/error.type";
import api from "../(utils)/axios";

export const goalQueryData = {
  getGoals: "get-goals",
};

export const goalsService = {
  create: async (data: UpsertGoalRequest) => {
    const response = await api.post("/savings-goals", data);
    return response.data;
  },

  get: async () => {
    const response = await api.get("/savings-goals");
    return response.data;
  },

  addValue: async (data: AddValueToGoalRequest) => {
    const response = await api.post(
      `/savings-goals/${data.goalId}/add-amount`,
      {
        amount: data.amount,
      }
    );
    return response.data;
  },

  update: async (data: UpsertGoalRequest) => {
    const response = await api.put(`/savings-goals/${data.id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/savings-goals/${id}`);
    return response.data;
  },
};

export const CreateGoal = (
  options?: UseMutationOptions<
    UpsertGoalResponse,
    CustomAxiosError,
    UpsertGoalRequest
  >
) => {
  return useMutation<UpsertGoalResponse, CustomAxiosError, UpsertGoalRequest>({
    mutationFn: goalsService.create,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};

export const GetGoals = (
  options?: UseQueryOptions<
    GetGoalsResponse,
    CustomAxiosError,
    GetGoalsResponse
  >
) => {
  return useQuery<GetGoalsResponse, CustomAxiosError, GetGoalsResponse>({
    queryKey: [goalQueryData.getGoals],
    queryFn: goalsService.get,
    ...options,
  });
};

export const AddValueToGoal = (
  options?: UseMutationOptions<
    AddValueToGoalResponse,
    CustomAxiosError,
    AddValueToGoalRequest
  >
) => {
  return useMutation<
    AddValueToGoalResponse,
    CustomAxiosError,
    AddValueToGoalRequest
  >({
    mutationFn: goalsService.addValue,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};

export const UpdateGoal = (
  options?: UseMutationOptions<
    UpsertGoalResponse,
    CustomAxiosError,
    UpsertGoalRequest
  >
) => {
  return useMutation<UpsertGoalResponse, CustomAxiosError, UpsertGoalRequest>({
    mutationFn: goalsService.update,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};

export const DeleteGoal = (
  options?: UseMutationOptions<UpsertGoalResponse, CustomAxiosError, string>
) => {
  return useMutation<UpsertGoalResponse, CustomAxiosError, string>({
    mutationFn: goalsService.delete,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};
