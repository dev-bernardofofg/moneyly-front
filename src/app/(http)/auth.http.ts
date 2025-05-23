import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { SignInParams, SignInResponse } from "../(types)/auth";
import { AxiosError } from "axios";
import { authService } from "../(services)/auth.service";

export const SignInRequest = (
  options?: UseMutationOptions<SignInResponse, AxiosError, SignInParams>
) => {
  return useMutation<SignInResponse, AxiosError, SignInParams>({
    mutationFn: authService.signIn,
    onSuccess: (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
  });
};
