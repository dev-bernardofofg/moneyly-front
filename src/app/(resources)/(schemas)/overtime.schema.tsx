import { z } from 'zod';

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

export const UpsertOvertimeSchema = z
  .object({
    companyId: z.string().uuid('Empresa inválida'),
    categoryId: z.string().optional(),
    description: z.string().max(500, 'Máximo 500 caracteres').optional(),
    startTime: z.string().min(1, 'Horário de início é obrigatório'),
    endTime: z.string().min(1, 'Horário de fim é obrigatório'),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Horário de fim deve ser após o início',
          path: ['endTime'],
        });
      }
    }
  });

export const UpsertOvertimeDefaultValues = {
  companyId: '',
  categoryId: '',
  description: '',
  startTime: '',
  endTime: '',
};

export type UpsertOvertimeFormValues = z.infer<typeof UpsertOvertimeSchema>;
