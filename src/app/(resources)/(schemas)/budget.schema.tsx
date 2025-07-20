import { z } from "zod";

export const CreateBudgetSchema = z.object({
  categoryId: z.string().min(1, "Categoria é obrigatório"),
  monthlyLimit: z.string().min(1, "Limite é obrigatório"),
})

export const CreateBudgetDefaultValues = {
  categoryId: "",
  monthlyLimit: "",
}

export type CreateBudgetFormValues = z.infer<typeof CreateBudgetSchema>