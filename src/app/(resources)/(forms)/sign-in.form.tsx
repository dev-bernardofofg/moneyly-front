"use client";

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { useAuth } from "@/app/(contexts)/auth-provider";
import {
  SignInDefaultValues,
  SignInFormValues,
  SignInSchema,
} from "@/app/(resources)/(schemas)/sign-in.schema";
import { SignInRequest } from "@/app/(services)/auth.service";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const SignInForm = () => {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: SignInDefaultValues,
  });

  const { setAuth } = useAuth();

  const { mutate, isPending } = SignInRequest({
    onSuccess: (data) => {
      setAuth(data);
      toast.success("Login efetuado com sucesso.");
      router.push("/dashboard");
    },
    onError: ({ data }: any) => {
      toast.error(data.error);
    },
  });

  const handleForm = (data: SignInFormValues) => {
    mutate(data);
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
      </BaseForm>
    </Form>
  );
};
