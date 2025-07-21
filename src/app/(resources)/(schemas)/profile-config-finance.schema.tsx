import { z } from "zod"

export const profileConfigFinanceFormSchema = z.object({
  financialDayStart: z.number().min(1).max(31),
  financialDayEnd: z.number().min(1).max(31),
  monthlyIncome: z.string().min(1, { message: "O valor mensal é obrigatório" }),
})

export type ProfileConfigFinanceFormValues = z.infer<typeof profileConfigFinanceFormSchema>