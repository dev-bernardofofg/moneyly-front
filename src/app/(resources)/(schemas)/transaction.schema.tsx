import { z } from "zod";

export const UpsertTransactionSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  type: z.enum(["income", "expense"]),
  amount: z.string().min(1, "Valor é obrigatório"),
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
  date: new Date().toISOString().split('T')[0], // Formato yyyy-MM-dd
};

export type UpsertTransactionFormValues = z.infer<
  typeof UpsertTransactionSchema
>;