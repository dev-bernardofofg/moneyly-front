"use client";

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { useAuth } from "@/app/(contexts)/auth-provider";
import { getErrorMessage, setFormFieldErrors } from "@/app/(helpers)/errors";
import { usePostAuthGoogle, usePostAuthSignUp } from "@/app/(resources)/(generated)/hooks/auth/auth";
import {
  SignUpDefaultValues,
  SignUpFormValues,
  SignUpSchema,
} from "@/app/(routes)/(public)/auth/auth.schema";
import { CustomAxiosError } from "@/app/(types)/error.type";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Key, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const SignUpForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: SignUpDefaultValues,
  });

  const { setAuth } = useAuth();

  const { mutate, isPending } = usePostAuthSignUp({
    mutation: {
      onSuccess: (axiosResponse) => {
        setAuth(axiosResponse);
        toast.success("Conta criada com sucesso. Você será redirecionado..");
        router.push("/dashboard");
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
        setFormFieldErrors(error, form.setError, ['name', 'email', 'password']);
      },
    },
  });

  const { mutate: googleMutate } = usePostAuthGoogle({
    mutation: {
      onSuccess: (axiosResponse) => {
        setAuth(axiosResponse);
        toast.success("Conta criada com sucesso via Google.");
        router.push("/dashboard");
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  const handleGoogleSuccess = (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error("Não foi possível obter as credenciais do Google.");
      return;
    }
    googleMutate({ data: { idToken: credentialResponse.credential } });
  };

  return (
    <Form {...form}>
      <BaseForm onSubmit={form.handleSubmit((formData: SignUpFormValues) => mutate({ data: formData }))}>
        <BaseInput
          control={form.control}
          name="name"
          Icon={User}
          label="Nome"
          placeholder="Insira seu nome"
          autoFocus
        />
        <BaseInput
          control={form.control}
          name="email"
          Icon={Mail}
          label="Email"
          placeholder="Insira seu email"
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
          Criar Conta
        </BaseButton>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => toast.error("Erro ao autenticar com o Google.")}
          theme="filled_blue"
          size="large"
        />
      </BaseForm>
    </Form>
  );
};
