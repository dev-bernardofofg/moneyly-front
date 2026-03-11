import { z } from "zod";

export const UpsertTransactionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  type: z.enum(["income", "expense"], { message: "Tipo inválido" }),
  amount: z
    .string()
    .min(1, "Valor é obrigatório")
    .refine((v) => {
      const num = parseFloat(v.replace(/\./g, "").replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Valor deve ser maior que zero"),
  category: z.string().optional(),
  description: z.string().optional(),
  date: z.string().min(1, "Data é obrigatória"),
});

export const UpsertTransactionDefaultValues = {
  title: "",
  type: "income" as const,
  amount: "",
  category: "",
  description: "",
  date: new Date().toISOString().split('T')[0],
};

export type UpsertTransactionFormValues = z.infer<
  typeof UpsertTransactionSchema
>;
