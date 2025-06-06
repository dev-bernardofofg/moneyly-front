import { authService } from "@/app/(services)/auth.service";
import { AuthResponse, SignInParams, SignUpParams } from "@/app/(types)/auth";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";

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
