import { z } from 'zod';

// BaseSelect devolve o valor como string ("26"); optional() deixa undefined passar sem coerção.
const dayOfMonth = z.coerce.number().int().min(1).max(31).optional();

export const AccountSchema = z
  .object({
    name: z.string().trim().min(1, 'Nome é obrigatório').max(60, 'Máximo de 60 caracteres'),
    type: z.enum(['checking', 'credit_card']),
    closingDay: dayOfMonth,
    dueDay: dayOfMonth,
    openingBalance: z.string().optional(),
    openingBalanceDate: z.string().optional(),
  })
  .refine((data) => data.type !== 'credit_card' || data.closingDay !== undefined, {
    message: 'Informe o dia de fechamento',
    path: ['closingDay'],
  })
  .refine((data) => data.type !== 'credit_card' || data.dueDay !== undefined, {
    message: 'Informe o dia de vencimento',
    path: ['dueDay'],
  })
  .refine((data) => data.type !== 'checking' || !data.openingBalance || !!data.openingBalanceDate, {
    message: 'Informe a data do saldo',
    path: ['openingBalanceDate'],
  });

export const AccountDefaultValues: AccountFormValues = {
  name: '',
  type: 'credit_card',
  closingDay: undefined,
  dueDay: undefined,
  openingBalance: '',
  openingBalanceDate: '',
};

export type AccountFormValues = z.infer<typeof AccountSchema>;
