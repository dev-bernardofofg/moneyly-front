import { z } from "zod";

export const UpsertTransactionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  type: z.enum(["income", "expense"]),
  amount: z.coerce.number().min(1, "Valor é obrigatório"),
  category: z.string().optional(),
  description: z.string().min(1, "Descrição é obrigatória"),
  date: z.string().min(1, "Data é obrigatória"),
});

export const UpsertTransactionDefaultValues = {
  title: "",
  type: "income" as const,
  amount: 0,
  category: "",
  description: "",
  date: new Date().toISOString().split('T')[0], // Formato yyyy-MM-dd
};

export type UpsertTransactionFormValues = z.infer<
  typeof UpsertTransactionSchema
>;