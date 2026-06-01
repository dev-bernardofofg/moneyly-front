import { z } from 'zod';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';

export const UpsertTransactionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  type: z.enum(['income', 'expense'], { message: 'Tipo inválido' }),
  amount: z
    .string()
    .min(1, 'Valor é obrigatório')
    .refine((v) => {
      const num = parseFloat(v.replace(/\./g, '').replace(',', '.'));
      return !isNaN(num) && num > 0;
    }, 'Valor deve ser maior que zero'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().optional(),
  date: z.string().min(1, 'Data é obrigatória'),
});

export const UpsertTransactionDefaultValues = {
  title: '',
  type: 'income' as const,
  amount: '',
  category: '',
  description: '',
  date: FN_UTILS_DATE.today(),
};

export type UpsertTransactionFormValues = z.infer<typeof UpsertTransactionSchema>;

export const UpsertTransactionRecurringSchema = z
  .object({
    type: z.enum(['income', 'expense'], { message: 'Tipo inválido' }),
    title: z.string().min(1, 'Título é obrigatório'),
    amount: z
      .string()
      .min(1, 'Valor é obrigatório')
      .refine((v) => {
        const num = parseFloat(v.replace(/\./g, '').replace(',', '.'));
        return !isNaN(num) && num > 0;
      }, 'Valor deve ser maior que zero'),
    categoryId: z.string().min(1, 'Categoria é obrigatória'),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly'], { message: 'Frequência inválida' }),
    dayOfWeek: z.string().optional(),
    dayOfMonth: z.string().optional(),
    description: z.string().optional(),
    totalInstallments: z
      .string()
      .optional()
      .refine((v) => !v || (Number.isInteger(Number(v)) && Number(v) >= 1), 'Mínimo 1 parcela'),
    startDate: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.frequency === 'weekly' && !data.dayOfWeek) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Dia da semana é obrigatório',
        path: ['dayOfWeek'],
      });
    }
    if (data.frequency === 'monthly' && !data.dayOfMonth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Dia do mês é obrigatório',
        path: ['dayOfMonth'],
      });
    }
  });

export const UpsertTransactionRecurringDefaultValues = {
  type: 'expense' as const,
  title: '',
  amount: '',
  categoryId: '',
  frequency: 'monthly' as const,
  dayOfWeek: '',
  dayOfMonth: '',
  description: '',
  totalInstallments: '',
  startDate: '',
};

export type UpsertTransactionRecurringFormValues = z.infer<typeof UpsertTransactionRecurringSchema>;
