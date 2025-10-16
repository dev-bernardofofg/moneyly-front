"use client";

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { useAuth } from "@/app/(contexts)/auth-provider";
import { getErrorMessage } from "@/app/(helpers)/errors";
import {
  SignInDefaultValues,
  SignInFormValues,
  SignInSchema,
} from "@/app/(resources)/(schemas)/auth.schema";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { usePostAuthSignIn } from "@/app/(resources)/(generated)/hooks/auth/auth";
import { GoogleSignInRequest } from "@/app/(services)/auth.service";
import type { AuthResponse } from "@/app/(types)/auth.type";
import type { CustomAxiosError } from "@/app/(types)/error.type";
import { Separator } from "@/components/ui/separator";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

export const SignInForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: SignInDefaultValues,
  });

  const { setAuth } = useAuth();

  // Hook gerado pelo Orval para sign-in
  const { mutate, isPending } = usePostAuthSignIn<CustomAxiosError>({
    mutation: {
      onSuccess: (axiosResponse) => {
        // O Orval retorna AxiosResponse, então pegamos .data para obter AuthResponse
        const authResponse = axiosResponse.data as AuthResponse;
        setAuth(authResponse);
        toast.success("Login efetuado com sucesso.");

        const user = authResponse.data?.user;
        const needsConfig = !user ||
          !user.monthlyIncome ||
          user.monthlyIncome === 0 ||
          user.financialDayStart === undefined ||
          user.financialDayEnd === undefined;

        if (needsConfig) {
          router.push("/initial-config");
        } else {
          router.push("/dashboard");
        }
      },
      onError: (error) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      },
    },
  });

  const { mutate: googleSignIn } = GoogleSignInRequest({
    onSuccess: (data) => {
      setAuth(data);
      toast.success("Login efetuado com sucesso.");

      const user = data.data.user;
      const needsConfig = !user ||
        !user.monthlyIncome ||
        user.monthlyIncome === 0 ||
        user.financialDayStart === undefined ||
        user.financialDayEnd === undefined;

      if (needsConfig) {
        router.push("/initial-config");
      } else {
        router.push("/dashboard");
      }
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const handleForm = (formData: SignInFormValues) => {
    // O Orval espera os dados no formato { data: PostAuthSignInBody }
    mutate({ data: formData });
  };

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (credentialResponse.credential) {
      googleSignIn({ token: credentialResponse.credential });
    } else {
      toast.error("Erro ao obter credenciais do Google");
    }
  };

  const handleGoogleError = () => {
    toast.error("Erro ao fazer login com o Google");
  };

  return (
    <Form {...form}>
      <BaseForm onSubmit={form.handleSubmit(handleForm)}>
        <BaseInput
          control={form.control}
          name="email"
          Icon={Mail}
          label="Email"
          placeholder="Insira seu email"
          autoFocus
        />
        <BaseInput
          control={form.control}
          name="password"
          Icon={Key}
          label="Senha"
          placeholder="Insira sua senha"
          type="password"
        />
        <BaseButton isLoading={isPending} className="w-full" type="submit">
          Logar
        </BaseButton>

        <Separator />

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_blue"
          size="large"
        />
      </BaseForm>
    </Form>
  );
};
