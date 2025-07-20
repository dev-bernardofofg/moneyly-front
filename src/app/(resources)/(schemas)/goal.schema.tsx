import { z } from "zod";

export const GoalSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  targetAmount: z.string().min(1, "Valor alvo é obrigatório"),
  targetDate: z.string().min(1, "Data alvo é obrigatória"),
});

export const GoalDefaultValues = {
  title: "",
  description: "",
  targetAmount: "",
  targetDate: "",
};

export type GoalFormValues = z.infer<typeof GoalSchema>;


export const AddValueToGoalSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
});

export type AddValueToGoalFormValues = z.infer<typeof AddValueToGoalSchema>;

export const AddValueToGoalDefaultValues = {
  amount: "",
};  