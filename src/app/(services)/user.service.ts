import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";

import { AuthResponse, InitialConfigParams } from "../(types)/auth.type";
import { CustomAxiosError } from "../(types)/error.type";
import { UpdateProfileResponse } from "../(types)/user.type";
import api from "../(utils)/axios";

export const userQueryData = {
  me: "ME",
};

export const userService = {
  async updateInitialConfig(
    params: InitialConfigParams
  ): Promise<AuthResponse> {
    const response = await api.put("/user/income-and-period", params);
    return response.data;
  },

  getProfile: async (): Promise<AuthResponse> => {
    const response = await api.get("/user/profile");
    return response.data;
  },

  updateProfile: async (
    params: InitialConfigParams
  ): Promise<UpdateProfileResponse> => {
    const response = await api.put("/user/income-and-period", params);
    return response.data;
  },

  getMe: async (): Promise<AuthResponse> => {
    const response = await api.get("/user/me");

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
  options?: UseMutationOptions<AuthResponse, CustomAxiosError>
) => {
  return useMutation<AuthResponse, CustomAxiosError>({
    mutationFn: userService.getMe,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
    ...options,
  });
};

export const UpdateProfileRequest = (
  options?: UseMutationOptions<
    UpdateProfileResponse,
    CustomAxiosError,
    InitialConfigParams
  >
) => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProfileResponse,
    CustomAxiosError,
    InitialConfigParams
  >({
    mutationFn: userService.updateProfile,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: [userQueryData.me] });

      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
    ...options,
  });
};
