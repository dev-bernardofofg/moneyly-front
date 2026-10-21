import { z } from 'zod';
import { FN_UTILS_DATE } from '@/lib/date';

export const TransferSchema = z
  .object({
    fromAccountId: z.string().min(1, 'Escolha a conta de origem'),
    toAccountId: z.string().min(1, 'Escolha a conta de destino'),
    amount: z
      .string()
      .min(1, 'Valor é obrigatório')
      .refine((v) => Number(v.replace(/\D/g, '')) > 0, 'Valor deve ser maior que zero'),
    date: z.string().min(1, 'Data é obrigatória'),
    description: z.string().optional(),
  })
  .refine((data) => data.fromAccountId !== data.toAccountId, {
    message: 'Escolha contas diferentes',
    path: ['toAccountId'],
  });

export const TransferDefaultValues = {
  fromAccountId: '',
  toAccountId: '',
  amount: '',
  date: FN_UTILS_DATE.today(),
  description: '',
};

export type TransferFormValues = z.infer<typeof TransferSchema>;
