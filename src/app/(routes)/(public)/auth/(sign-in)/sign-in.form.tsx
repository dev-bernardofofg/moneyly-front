"use client";

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { useAuth } from "@/app/(contexts)/auth-provider";
import {
  SignInDefaultValues,
  SignInFormValues,
  SignInSchema,
} from "@/app/(routes)/(public)/auth/auth.schema";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getErrorMessage } from "@/app/(helpers)/errors";
import { usePostAuthSignIn } from "@/app/(resources)/(generated)/hooks/auth/auth";
import { CustomAxiosError } from "@/app/(types)/error.type";
import { Separator } from "@/components/ui/separator";
import { CodeResponse, GoogleLogin, useGoogleLogin } from "@react-oauth/google";

export const SignInForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: SignInDefaultValues,
  });

  const { setAuth } = useAuth();

  const { mutate, isPending } = usePostAuthSignIn({
    mutation: {
      onSuccess: (data) => {
        setAuth(data);
        toast.success(data.message ?? "Login realizado com sucesso");
        router.push("/dashboard");
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  const googleSignIn = useGoogleLogin({
    onSuccess: (codeResponse: CodeResponse) => {
      mutate({ data: { email: codeResponse.code, password: "" } });
      toast.success("Login com Google realizado com sucesso. Você será redirecionado..");
      router.push("/dashboard");
    },
  });

  const handleForm = (formData: SignInFormValues) => {
    mutate({ data: formData });
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
          onSuccess={googleSignIn}
          onError={() => {
            toast.error("Erro ao fazer login com o Google");
          }}
          theme="filled_blue"
          size="large"
        />
      </BaseForm>
    </Form>
  );
};
