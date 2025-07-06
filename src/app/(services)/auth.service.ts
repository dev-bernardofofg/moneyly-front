import { AuthResponse, SignInParams, SignUpParams } from "@/app/(types)/auth";
import { CustomAxiosError } from "@/app/(types)/error";
import api from "@/app/(utils)/axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const authService = {
  signIn: async (params: SignInParams): Promise<AuthResponse> => {
    const response = await api.post("/auth/sign-in", params);

    return response.data;
  },

  signUp: async (params: SignUpParams): Promise<AuthResponse> => {
    const response = await api.post("/auth/sign-up", params);

    return response.data;
  },
};

export const SignInRequest = (
  options?: UseMutationOptions<AuthResponse, CustomAxiosError, SignInParams>
) => {
  return useMutation<AuthResponse, CustomAxiosError, SignInParams>({
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
  options?: UseMutationOptions<AuthResponse, CustomAxiosError, SignUpParams>
) => {
  return useMutation<AuthResponse, CustomAxiosError, SignUpParams>({
    mutationFn: authService.signUp,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    onError: (data, variables, context) => {
      options?.onError?.(data, variables, context);
    },
  });
};
