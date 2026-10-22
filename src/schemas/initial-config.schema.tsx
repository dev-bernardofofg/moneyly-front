import { z } from 'zod';

export const InitialConfigSchema = z.object({
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
  financialDayStart: 1,
  financialDayEnd: 1,
};

export type InitialConfigFormValues = z.infer<typeof InitialConfigSchema>;
