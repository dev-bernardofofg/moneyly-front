import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const SignInDefaultValues = {
  email: '',
  password: '',
}

export type SignInFormValues = z.infer<typeof SignInSchema>