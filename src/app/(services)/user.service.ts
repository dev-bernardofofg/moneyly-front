import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

import { AuthResponse, InitialConfigParams } from "../(types)/auth";
import { CustomAxiosError } from "../(types)/error";
import api from "../(utils)/axios";

export const userQueryData = {
  me: "ME",
};

export const userService = {
  async updateInitialConfig(
    params: InitialConfigParams
  ): Promise<AuthResponse> {
    const response = await api.put("/users/income-and-period", params);
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/users/profile");
    return response.data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const response = await api.get("/users/me");

    return response.data;
  },
};

export const UpdateInitialConfigRequest = (
  options?: UseMutationOptions<
    AuthResponse,
    CustomAxiosError,
    InitialConfigParams
  >
) => {
  return useMutation<AuthResponse, CustomAxiosError, InitialConfigParams>({
    mutationFn: userService.updateInitialConfig,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
    ...options,
  });
};

export const GetMeRequest = (
  options?: UseQueryOptions<AuthResponse, CustomAxiosError>
) => {
  return useQuery<AuthResponse, CustomAxiosError>({
    queryKey: [userQueryData.me],
    queryFn: userService.getMe,
    staleTime: Infinity,
    ...options,
  });
};
