import { AuthResponse, SignInParams, SignUpParams } from "@/app/(types)/auth";
import api from "@/app/(utils)/axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const authService = {
  signIn: async (params: SignInParams): Promise<AuthResponse> => {
    const response = await api.post("/users/sign-in", params);

    return response.data;
  },

  signUp: async (params: SignUpParams): Promise<AuthResponse> => {
    const response = await api.post("/users/sign-up", params);

    return response.data;
  },
};

export const SignInRequest = (
  options?: UseMutationOptions<AuthResponse, AxiosError, SignInParams>
) => {
  return useMutation<AuthResponse, AxiosError, SignInParams>({
    mutationFn: authService.signIn,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};

export const SignUpRequest = (
  options?: UseMutationOptions<AuthResponse, AxiosError, SignUpParams>
) => {
  return useMutation<AuthResponse, AxiosError, SignUpParams>({
    mutationFn: authService.signUp,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};
