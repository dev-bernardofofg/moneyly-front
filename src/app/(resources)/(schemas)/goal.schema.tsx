import { z } from "zod";

export const GoalSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  targetAmount: z
    .string()
    .min(1, "Valor alvo é obrigatório")
    .refine((v) => {
      const num = parseFloat(v.replace(/\./g, "").replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Valor alvo deve ser maior que zero"),
  targetDate: z
    .string()
    .min(1, "Data alvo é obrigatória")
    .refine((v) => new Date(v) > new Date(), "Data alvo deve ser no futuro"),
});

export const GoalDefaultValues = {
  title: "",
  description: "",
  targetAmount: "",
  targetDate: "",
};

export type GoalFormValues = z.infer<typeof GoalSchema>;


export const AddValueToGoalSchema = z.object({
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((v) => {
      const num = parseFloat(v.replace(/\./g, "").replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Valor deve ser maior que zero"),
});

export type AddValueToGoalFormValues = z.infer<typeof AddValueToGoalSchema>;

export const AddValueToGoalDefaultValues = {
  amount: "",
};  