"use client";

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { SignInRequest } from "@/app/(http)/auth.http";
import {
  SignInDefaultValues,
  SignInFormValues,
  SignInSchema,
} from "@/app/(resources)/(schemas)/sign-in.schema";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const SignInForm = () => {
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: SignInDefaultValues,
  });

  const { mutate, isPending } = SignInRequest({
    onSuccess: () => {
      toast.success("Login efetuado com sucesso.");
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
        <Image
          src="/logo-single.png"
          alt="logo-moneyly"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <h1 className="text-center text-2xl font-bold mb-4 drop-shadow shadow-primary">
          Entrar
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-4">
          Entre com sua conta
        </p>
        <div className="space-y-4">
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
        </div>

        <div className="flex items-center">
          <Link
            href="/sign-up"
            className="text-neutral-500 hover:text-primary transition-colors duration-200"
          >
            Nâo possui uma senha? Crie uma conta
          </Link>
        </div>
      </BaseForm>
    </Form>
  );
};
