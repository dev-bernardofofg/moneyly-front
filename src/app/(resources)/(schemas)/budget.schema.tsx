import { z } from "zod";

export const CreateBudgetSchema = z.object({
  categoryId: z.string().min(1, "Categoria é obrigatória"),
  monthlyLimit: z
    .string()
    .min(1, "Limite é obrigatório")
    .refine((v) => {
      const num = parseFloat(v.replace(/\./g, "").replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Limite deve ser maior que zero"),
})

export const CreateBudgetDefaultValues = {
  categoryId: "",
  monthlyLimit: "",
}

export type CreateBudgetFormValues = z.infer<typeof CreateBudgetSchema>