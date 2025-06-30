"use client";

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { useAuth } from "@/app/(contexts)/auth-provider";
import {
  SignUpDefaultValues,
  SignUpFormValues,
  SignUpSchema,
} from "@/app/(resources)/(schemas)/auth.schema";
import { SignUpRequest } from "@/app/(services)/auth.service";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
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

  const { mutate, isPending } = SignUpRequest({
    onSuccess: (data) => {
      setAuth(data);
      toast.success("Conta criada com sucesso. Você será redirecionado..");
      router.push("/dashboard");
    },
    onError: ({ data }: any) => {
      toast.error(data.error);
    },
  });

  const handleForm = (data: SignUpFormValues) => {
    mutate(data);
  };
  return (
    <Form {...form}>
      <BaseForm onSubmit={form.handleSubmit(handleForm)}>
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
          Criar conta
        </BaseButton>
      </BaseForm>
    </Form>
  );
};
