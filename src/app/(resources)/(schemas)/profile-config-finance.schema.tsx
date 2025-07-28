import { z } from "zod"

export const profileConfigFinanceFormSchema = z.object({
  financialDayStart: z.coerce.string().min(1, { message: "O dia inicial é obrigatório" }),
  financialDayEnd: z.coerce.string().min(1, { message: "O dia final é obrigatório" }),
  monthlyIncome: z.string().min(1, { message: "O valor mensal é obrigatório" }),
})

export type ProfileConfigFinanceFormValues = z.infer<typeof profileConfigFinanceFormSchema>