import { z } from 'zod';

const dayInRange = (v: string) => {
  const n = Number(v);
  return Number.isInteger(n) && n >= 1 && n <= 31;
};

export const profileConfigFinanceFormSchema = z.object({
  financialDayStart: z.coerce
    .string()
    .min(1, { message: 'O dia inicial é obrigatório' })
    .refine(dayInRange, { message: 'Dia deve ser entre 1 e 31' }),
  financialDayEnd: z.coerce
    .string()
    .min(1, { message: 'O dia final é obrigatório' })
    .refine(dayInRange, { message: 'Dia deve ser entre 1 e 31' }),
  monthlyIncome: z
    .string()
    .min(1, { message: 'O valor mensal é obrigatório' })
    .refine(
      (v) => {
        const n = parseFloat(v.replace(/\./g, '').replace(',', '.'));
        return Number.isFinite(n) && n > 0;
      },
      { message: 'Renda mensal deve ser maior que zero' }
    ),
});

export type ProfileConfigFinanceFormValues = z.infer<typeof profileConfigFinanceFormSchema>;
