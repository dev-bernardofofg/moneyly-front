"use client";

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { useAuth } from "@/app/(contexts)/auth-provider";
import { getErrorMessage, setFormFieldErrors } from "@/app/(helpers)/errors";
import { usePostAuthSignUp } from "@/app/(resources)/(generated)/hooks/auth/auth";
import {
  SignUpDefaultValues,
  SignUpFormValues,
  SignUpSchema,
} from "@/app/(routes)/(public)/auth/auth.schema";
import { CustomAxiosError } from "@/app/(types)/error.type";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CodeResponse, GoogleLogin, useGoogleLogin } from "@react-oauth/google";
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
        // Com o interceptor, axiosResponse.data já é { user, accessToken, refreshToken }
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

  const googleSignIn = useGoogleLogin({
    onSuccess: (_codeResponse: CodeResponse) => {
      // TODO: implementar exchange de token com o backend
    },
  });

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
          onSuccess={googleSignIn}
          theme="filled_blue"
          size="large"
        />
      </BaseForm>
    </Form>
  );
};
