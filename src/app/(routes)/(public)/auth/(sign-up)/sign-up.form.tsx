"use client";

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { GoogleAuthButton } from "@/app/(components)/(bases)/(clickable)/google-button";
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import {
  SignUpDefaultValues,
  SignUpFormValues,
  SignUpSchema,
} from "@/app/(routes)/(public)/auth/auth.schema";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuthActions } from "../auth.actions";

export const SignUpForm = () => {
  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: SignUpDefaultValues,
  });

  const { signUp: { mutate: signUpMutate, isPending: signUpPending }, google: { mutate: googleMutate, isPending: googlePending } } = useAuthActions(form);

  return (
    <Form {...form}>
      <BaseForm onSubmit={form.handleSubmit((formData: SignUpFormValues) => signUpMutate({ data: formData }))}>
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
        <BaseButton isLoading={signUpPending} className="w-full" type="submit">
          Criar Conta
        </BaseButton>

        <GoogleAuthButton
          onSuccess={(idToken: string) => googleMutate({ data: { idToken } })}
          isLoading={googlePending}
        />
      </BaseForm>
    </Form>
  );
};
