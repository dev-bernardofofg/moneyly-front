"use client";

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import {
  SignInDefaultValues,
  SignInFormValues,
  SignInSchema,
} from "@/app/(routes)/(public)/auth/auth.schema";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Key, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Separator } from "@/components/ui/separator";
import { GoogleAuthButton } from "@/app/(components)/(bases)/(clickable)/google-button";
import { useAuthActions } from "../auth.actions";

export const SignInForm = () => {
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: SignInDefaultValues,
  });

  const { signIn: { mutate: signInMutate, isPending: signInPending }, google: { mutate: googleMutate, isPending: googlePending } } = useAuthActions(form);

  return (
    <Form {...form}>
      <BaseForm onSubmit={form.handleSubmit((formData: SignInFormValues) => signInMutate({ data: formData }))}>
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
        <BaseButton isLoading={signInPending} className="w-full" type="submit">
          Logar
        </BaseButton>

        <Separator />

        <GoogleAuthButton
          onSuccess={(idToken: string) => googleMutate({ data: { idToken } })}
          isLoading={googlePending}
        />
      </BaseForm>
    </Form>
  );
};
