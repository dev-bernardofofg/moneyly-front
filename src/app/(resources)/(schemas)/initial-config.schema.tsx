import { z } from "zod";

export const InitialConfigSchema = z.object({
  monthlyIncome: z.string()
    .min(0.01, 'Renda mensal deve ser maior que zero')
    .max(999999999, 'Renda mensal muito alta'),
  financialDayStart: z.coerce.number()
    .min(1, 'Dia de início deve ser entre 1 e 31')
    .max(31, 'Dia de início deve ser entre 1 e 31'),
  financialDayEnd: z.coerce.number()
    .min(1, 'Dia de fim deve ser entre 1 e 31')
    .max(31, 'Dia de fim deve ser entre 1 e 31'),
});

export const InitialConfigDefaultValues = {
  monthlyIncome: '',
  financialDayStart: 1,
  financialDayEnd: 1,
}

export type InitialConfigFormValues = z.infer<typeof InitialConfigSchema>; 