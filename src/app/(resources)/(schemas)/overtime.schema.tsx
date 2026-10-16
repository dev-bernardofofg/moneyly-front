import { addDays, format, parseISO } from 'date-fns';
import { z } from 'zod';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';

export const UpsertCompanySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  hourlyRate: z
    .string()
    .min(1, 'Valor hora é obrigatório')
    .refine((v) => {
      const num = parseFloat(v.replace(/\./g, '').replace(',', '.'));
      return !isNaN(num) && num > 0;
    }, 'Valor hora deve ser maior que zero'),
});

export const UpsertCompanyDefaultValues = {
  name: '',
  hourlyRate: '',
};

export type UpsertCompanyFormValues = z.infer<typeof UpsertCompanySchema>;

const CLOCK = /^([01]\d|2[0-3]):[0-5]\d$/;

const nextDay = (date: string) => format(addDays(parseISO(date), 1), 'yyyy-MM-dd');

/**
 * Data + horário de início e fim (inputs nativos: não quebram o layout no celular).
 * Fim menor que o início = turno que vira a noite, termina no dia seguinte.
 */
export const overtimeRange = (date: string, start: string, end: string) => {
  const overnight = end < start;
  return {
    startLocal: `${date}T${start}`,
    endLocal: `${overnight ? nextDay(date) : date}T${end}`,
    overnight,
  };
};

export const UpsertOvertimeSchema = z
  .object({
    companyId: z.string().uuid('Empresa inválida'),
    categoryId: z.string().optional(),
    description: z.string().max(500, 'Máximo 500 caracteres').optional(),
    date: z.string().min(1, 'Data é obrigatória'),
    start: z.string().regex(CLOCK, 'Início é obrigatório'),
    end: z.string().regex(CLOCK, 'Fim é obrigatório'),
  })
  .superRefine((data, ctx) => {
    if (!data.date || !CLOCK.test(data.start) || !CLOCK.test(data.end)) return;
    if (data.start === data.end) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Fim igual ao início', path: ['end'] });
      return;
    }
    const { startLocal } = overtimeRange(data.date, data.start, data.end);
    if (new Date(FN_UTILS_DATE.fromBusinessDatetimeLocal(startLocal)) > new Date()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Início não pode ser no futuro',
        path: ['start'],
      });
    }
  });

export const UpsertOvertimeDefaultValues = {
  companyId: '',
  categoryId: '',
  description: '',
  date: FN_UTILS_DATE.today(),
  start: '',
  end: '',
};

export type UpsertOvertimeFormValues = z.infer<typeof UpsertOvertimeSchema>;
