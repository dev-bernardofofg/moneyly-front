'use client';

import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form';
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input';
import { BaseSelect } from '@/app/(components)/(bases)/(forms)/base-select';
import { DialogFormFooter } from '@/app/(components)/(bases)/(forms)/dialog-form-footer';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { useUpsertDialog } from '@/app/(hooks)/use-upsert-dialog';
import { Form } from '@/components/ui/form';
import { Category, OvertimeRecord } from '../(generated)';
import { useGetCategories } from '../(generated)/hooks/categories/categories';
import { useGetCompanies } from '../(generated)/hooks/companies/companies';
import {
  getGetOvertimeQueryKey,
  getGetOvertimeSummaryQueryKey,
  usePostOvertime,
  usePutOvertimeId,
} from '../(generated)/hooks/overtime/overtime';
import {
  overtimeRange,
  UpsertOvertimeDefaultValues,
  UpsertOvertimeFormValues,
  UpsertOvertimeSchema,
} from '../(schemas)/overtime.schema';

const FIELDS = ['companyId', 'categoryId', 'description', 'date', 'start', 'end'] as const;

const calcHours = (date: string, start: string, end: string): number | null => {
  if (!date || !start || !end || start === end) return null;
  const { startLocal, endLocal } = overtimeRange(date, start, end);
  return (new Date(endLocal).getTime() - new Date(startLocal).getTime()) / 3600000;
};

export const UpsertOvertimeForm = ({ overtimeRecord }: { overtimeRecord?: OvertimeRecord }) => {
  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<UpsertOvertimeFormValues>({
      schema: UpsertOvertimeSchema,
      defaultValues: overtimeRecord
        ? {
            companyId: overtimeRecord.companyId,
            categoryId: '',
            description: overtimeRecord.description ?? '',
            date: FN_UTILS_DATE.toBusinessDatetimeLocal(overtimeRecord.startTime).slice(0, 10),
            start: FN_UTILS_DATE.toBusinessDatetimeLocal(overtimeRecord.startTime).slice(11, 16),
            end: FN_UTILS_DATE.toBusinessDatetimeLocal(overtimeRecord.endTime).slice(11, 16),
          }
        : UpsertOvertimeDefaultValues,
      invalidateKeys: [getGetOvertimeQueryKey(), getGetOvertimeSummaryQueryKey()],
      errorFields: [...FIELDS],
      successMessage: {
        create: 'Hora extra registrada com sucesso',
        update: 'Hora extra atualizada com sucesso',
      },
    });

  const date = form.watch('date');
  const start = form.watch('start');
  const end = form.watch('end');
  const companyId = form.watch('companyId');

  const { data: companies, isLoading: isLoadingCompanies } = useGetCompanies();
  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();

  const selectedCompany = companies?.data?.find((c) => c.id === companyId);
  const hours = calcHours(date, start, end);
  const overnight = Boolean(start && end && end < start);
  const preview =
    hours !== null && selectedCompany ? hours * parseFloat(selectedCompany.hourlyRate) : null;

  const { mutate: createOvertime, isPending: isCreating } = usePostOvertime({
    mutation: {
      onSuccess: onCreated,
      onError,
    },
  });

  const { mutate: updateOvertime, isPending: isUpdating } = usePutOvertimeId({
    mutation: {
      onSuccess: onUpdated,
      onError,
    },
  });

  const handleSubmit = (data: UpsertOvertimeFormValues) => {
    const { startLocal, endLocal } = overtimeRange(data.date, data.start, data.end);
    const payload = {
      companyId: data.companyId,
      categoryId: data.categoryId || undefined,
      description: data.description ?? '',
      startTime: FN_UTILS_DATE.fromBusinessDatetimeLocal(startLocal),
      endTime: FN_UTILS_DATE.fromBusinessDatetimeLocal(endLocal),
    };

    if (overtimeRecord) {
      updateOvertime({ id: overtimeRecord.id, data: payload });
    } else {
      createOvertime({ data: payload });
    }
  };

  return (
    <>
      <DialogCloseHidden />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleSubmit)}>
          <BaseSelect
            control={form.control}
            name="companyId"
            label="Empresa"
            isLoading={isLoadingCompanies}
            emptyMessage="Nenhuma empresa. Cadastre em Gerenciar empresas."
            options={
              companies?.data?.map((c) => ({
                label: c.name,
                value: c.id,
              })) || []
            }
          />
          <BaseInput control={form.control} name="date" label="Data" type="date" />
          <div className="grid grid-cols-2 gap-2">
            <BaseInput control={form.control} name="start" label="Início" type="time" />
            <BaseInput control={form.control} name="end" label="Fim" type="time" />
          </div>
          {overnight && <p className="text-xs text-muted-foreground">Termina no dia seguinte.</p>}
          {hours !== null && preview !== null && (
            <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              {hours.toFixed(2).replace('.', ',')} h ={' '}
              <span className="font-semibold text-foreground">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(preview)}
              </span>
            </div>
          )}
          <BaseInput
            control={form.control}
            name="description"
            label="Descrição (opcional)"
            placeholder="Ex: Sprint review extra"
          />
          <BaseSelect
            control={form.control}
            name="categoryId"
            label="Categoria (opcional)"
            isLoading={isLoadingCategories}
            emptyMessage="Nenhuma categoria disponível"
            options={
              categories?.data?.map((cat: Category) => ({
                label: cat.name,
                value: cat.id,
              })) || []
            }
          />
          <DialogFormFooter
            submitLabel={overtimeRecord ? 'Atualizar' : 'Registrar'}
            isLoading={isCreating || isUpdating}
          />
        </BaseForm>
      </Form>
    </>
  );
};
