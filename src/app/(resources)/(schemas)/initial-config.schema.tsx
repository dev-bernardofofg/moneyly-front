import { z } from 'zod';

export const InitialConfigSchema = z.object({
  monthlyIncome: z
    .string()
    .min(1, 'Renda mensal é obrigatória')
    .refine((v) => {
      const num = parseFloat(v.replace(/\./g, '').replace(',', '.'));
      return Number.isFinite(num) && num > 0 && num < 1_000_000_000;
    }, 'Renda mensal deve ser maior que zero e menor que 1 bilhão'),
  financialDayStart: z.coerce
    .number()
    .min(1, 'Dia de início deve ser entre 1 e 31')
    .max(31, 'Dia de início deve ser entre 1 e 31'),
  financialDayEnd: z.coerce
    .number()
    .min(1, 'Dia de fim deve ser entre 1 e 31')
    .max(31, 'Dia de fim deve ser entre 1 e 31'),
});

export const InitialConfigDefaultValues = {
  monthlyIncome: '',
  financialDayStart: 1,
  financialDayEnd: 1,
};

export type InitialConfigFormValues = z.infer<typeof InitialConfigSchema>;
