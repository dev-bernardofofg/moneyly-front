'use client';

import { BaseDatePicker } from '@/app/(components)/(bases)/(forms)/base-date-picker';
import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form';
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input';
import { BaseSelect } from '@/app/(components)/(bases)/(forms)/base-select';
import { DialogFormFooter } from '@/app/(components)/(bases)/(forms)/dialog-form-footer';
import { useUpsertDialog } from '@/app/(hooks)/use-upsert-dialog';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { FN_UTILS_STRING } from '@/app/(helpers)/string';
import { Form } from '@/components/ui/form';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { Category, RecurringTransaction } from '../(generated)';
import { useGetCategories } from '../(generated)/hooks/categories/categories';
import {
  getGetRecurringTransactionsQueryKey,
  usePostRecurringTransactions,
  usePutRecurringTransactionsId,
} from '../(generated)/hooks/recurring-transactions/recurring-transactions';
import {
  UpsertTransactionRecurringDefaultValues,
  UpsertTransactionRecurringFormValues,
  UpsertTransactionRecurringSchema,
} from '../(schemas)/transaction.schema';

const FREQUENCY_OPTIONS = [
  { label: 'Diária', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensal', value: 'monthly' },
  { label: 'Anual', value: 'yearly' },
];

const DAY_OF_WEEK_OPTIONS = [
  { label: 'Domingo', value: '0' },
  { label: 'Segunda', value: '1' },
  { label: 'Terça', value: '2' },
  { label: 'Quarta', value: '3' },
  { label: 'Quinta', value: '4' },
  { label: 'Sexta', value: '5' },
  { label: 'Sábado', value: '6' },
];

const FIELDS = [
  'title',
  'amount',
  'type',
  'categoryId',
  'frequency',
  'dayOfWeek',
  'dayOfMonth',
  'description',
  'totalInstallments',
  'startDate',
] as const;

export type RecurringSeed = {
  title?: string;
  amount?: number;
  categoryId?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  dayOfMonth?: number;
  type?: 'income' | 'expense';
};

const seedDefaults = (seed?: RecurringSeed) => ({
  ...UpsertTransactionRecurringDefaultValues,
  ...(seed?.type ? { type: seed.type } : {}),
  ...(seed?.title ? { title: seed.title } : {}),
  ...(seed?.amount != null
    ? { amount: FN_UTILS_STRING.formatReaisToMoneyInputDigits(seed.amount) }
    : {}),
  ...(seed?.categoryId ? { categoryId: seed.categoryId } : {}),
  ...(seed?.frequency ? { frequency: seed.frequency } : {}),
  ...(seed?.dayOfMonth != null ? { dayOfMonth: String(seed.dayOfMonth) } : {}),
});

export const UpsertTransactionRecurringForm = ({
  recurringTransaction,
  seed,
}: {
  recurringTransaction?: RecurringTransaction;
  seed?: RecurringSeed;
}) => {
  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<UpsertTransactionRecurringFormValues>({
      schema: UpsertTransactionRecurringSchema,
      defaultValues: recurringTransaction
        ? {
            type: recurringTransaction.type as 'income' | 'expense',
            title: recurringTransaction.title,
            amount: FN_UTILS_STRING.formatReaisToMoneyInputDigits(recurringTransaction.amount),
            categoryId: recurringTransaction.categoryId,
            frequency: recurringTransaction.frequency as 'daily' | 'weekly' | 'monthly' | 'yearly',
            dayOfWeek:
              recurringTransaction.dayOfWeek != null ? String(recurringTransaction.dayOfWeek) : '',
            dayOfMonth:
              recurringTransaction.dayOfMonth != null
                ? String(recurringTransaction.dayOfMonth)
                : '',
            description: recurringTransaction.description ?? '',
            totalInstallments:
              recurringTransaction.totalInstallments != null
                ? String(recurringTransaction.totalInstallments)
                : '',
          }
        : seedDefaults(seed),
      invalidateKeys: [getGetRecurringTransactionsQueryKey()],
      errorFields: [...FIELDS],
      successMessage: {
        create: 'Transação recorrente criada com sucesso',
        update: 'Transação recorrente atualizada com sucesso',
      },
    });

  const frequency = form.watch('frequency');

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();

  const { mutate: createRecurring, isPending: isCreating } = usePostRecurringTransactions({
    mutation: {
      onSuccess: onCreated,
      onError,
    },
  });

  const { mutate: updateRecurring, isPending: isUpdating } = usePutRecurringTransactionsId({
    mutation: {
      onSuccess: onUpdated,
      onError,
    },
  });

  const handleSubmit = (data: UpsertTransactionRecurringFormValues) => {
    const sharedPayload = {
      title: data.title,
      amount: FN_UTILS_STRING.formatCurrentStringToNumber(data.amount),
      categoryId: data.categoryId,
      frequency: data.frequency,
      description: data.description || undefined,
      dayOfWeek: data.frequency === 'weekly' ? Number(data.dayOfWeek) : undefined,
      dayOfMonth: data.frequency === 'monthly' ? Number(data.dayOfMonth) : undefined,
      totalInstallments: data.totalInstallments ? Number(data.totalInstallments) : undefined,
    };

    if (recurringTransaction) {
      updateRecurring({ id: recurringTransaction.id, data: sharedPayload });
    } else {
      createRecurring({
        data: {
          ...sharedPayload,
          type: data.type,
          startDate: (() => {
            if (!data.startDate) return undefined;
            if (data.startDate <= FN_UTILS_DATE.today()) return undefined;
            return FN_UTILS_DATE.fromBusinessDatetimeLocal(`${data.startDate}T12:00`);
          })(),
        },
      });
    }
  };

  const hasConditionalField = frequency === 'weekly' || frequency === 'monthly';

  return (
    <>
      <DialogCloseHidden />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleSubmit)}>
          <BaseInput
            control={form.control}
            name="title"
            label="Título"
            placeholder="Ex: Pagamento de aluguel"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Tipo</span>
                  <div
                    className={cn(
                      'relative grid grid-cols-2 rounded-lg border overflow-hidden h-11 p-0.5 gap-0.5 transition-colors duration-300',
                      field.value === 'income'
                        ? 'border-income/60 bg-income/5'
                        : 'border-expense/60 bg-expense/5',
                      recurringTransaction && 'opacity-60 pointer-events-none'
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => field.onChange('income')}
                      className={cn(
                        'relative flex items-center justify-center gap-1.5 rounded-md text-sm font-semibold transition-all duration-300',
                        field.value === 'income'
                          ? 'bg-income text-income-foreground shadow-sm shadow-income/40'
                          : 'text-muted-foreground hover:text-foreground hover:bg-income/10'
                      )}
                    >
                      <TrendingUp className="size-3.5 shrink-0" />
                      Entrada
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange('expense')}
                      className={cn(
                        'relative flex items-center justify-center gap-1.5 rounded-md text-sm font-semibold transition-all duration-300',
                        field.value === 'expense'
                          ? 'bg-expense text-expense-foreground shadow-sm shadow-expense/40'
                          : 'text-muted-foreground hover:text-foreground hover:bg-expense/10'
                      )}
                    >
                      <TrendingDown className="size-3.5 shrink-0" />
                      Saída
                    </button>
                  </div>
                </div>
              )}
            />
            <BaseSelect
              control={form.control}
              name="categoryId"
              label="Categoria"
              isLoading={isLoadingCategories}
              emptyMessage="Nenhuma categoria. Crie em Categorias."
              options={
                categories?.data?.map((category: Category) => ({
                  label: category.name || '',
                  value: category.id || '',
                })) || []
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <BaseInput
              control={form.control}
              name="amount"
              label="Valor"
              type="money"
              placeholder="0,00"
            />
            <BaseInput
              control={form.control}
              name="totalInstallments"
              label="Parcelas"
              type="number"
              placeholder="Sem limite"
              description="Vazio = recorrência sem fim"
            />
          </div>
          {!recurringTransaction && (
            <BaseDatePicker
              control={form.control}
              name="startDate"
              label="Data de início"
              description="Vazio = criar primeira parcela agora"
            />
          )}
          <div className={cn('grid gap-2', hasConditionalField ? 'grid-cols-2' : 'grid-cols-1')}>
            <BaseSelect
              control={form.control}
              name="frequency"
              label="Frequência"
              options={FREQUENCY_OPTIONS}
            />
            {frequency === 'weekly' && (
              <BaseSelect
                control={form.control}
                name="dayOfWeek"
                label="Dia da semana"
                options={DAY_OF_WEEK_OPTIONS}
              />
            )}
            {frequency === 'monthly' && (
              <BaseSelect
                control={form.control}
                name="dayOfMonth"
                label="Dia do mês"
                type="full-date"
              />
            )}
          </div>

          <DialogFormFooter
            submitLabel={recurringTransaction ? 'Atualizar' : 'Criar'}
            isLoading={isCreating || isUpdating}
          />
        </BaseForm>
      </Form>
    </>
  );
};
