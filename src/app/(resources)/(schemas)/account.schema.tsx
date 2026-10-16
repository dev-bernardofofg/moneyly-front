import { z } from 'zod';

export const AccountSchema = z
  .object({
    name: z.string().trim().min(1, 'Nome é obrigatório').max(60, 'Máximo de 60 caracteres'),
    type: z.enum(['checking', 'credit_card']),
    closingDay: z.number().int().min(1).max(31).optional(),
    dueDay: z.number().int().min(1).max(31).optional(),
  })
  .refine((data) => data.type !== 'credit_card' || data.closingDay !== undefined, {
    message: 'Informe o dia de fechamento',
    path: ['closingDay'],
  })
  .refine((data) => data.type !== 'credit_card' || data.dueDay !== undefined, {
    message: 'Informe o dia de vencimento',
    path: ['dueDay'],
  });

export const AccountDefaultValues: AccountFormValues = {
  name: '',
  type: 'credit_card',
  closingDay: undefined,
  dueDay: undefined,
};

export type AccountFormValues = z.infer<typeof AccountSchema>;
