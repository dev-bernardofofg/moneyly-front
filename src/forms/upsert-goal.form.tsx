'use client';

import { BaseDatePicker } from '@/components/forms/base-date-picker';
import { BaseForm } from '@/components/forms/base-form';
import { BaseInput } from '@/components/forms/base-input';
import { BaseTextarea } from '@/components/forms/base-textarea';
import { DialogFormFooter } from '@/components/forms/dialog-form-footer';
import { FN_UTILS_DATE } from '@/lib/date';
import { useUpsertDialog } from '@/hooks/use-upsert-dialog';
import { FN_UTILS_STRING } from '@/lib/string';
import { Form } from '@/components/ui/form';
import { Goal } from '@/api/generated';
import {
  getGetGoalsQueryKey,
  usePostGoals,
  usePutGoalsId,
} from '@/api/generated/hooks/goals/goals';
import { freeBalanceQueryKeys } from '@/api/free-balance-query-keys';
import { GoalDefaultValues, GoalFormValues, GoalSchema } from '@/schemas/goal.schema';

interface UpsertGoalFormProps {
  goal?: Goal;
  onSaved?: () => void;
}

export const UpsertGoalForm = ({ goal, onSaved }: UpsertGoalFormProps) => {
  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<GoalFormValues>({
      schema: GoalSchema,
      defaultValues: goal
        ? {
            title: goal.title || '',
            description: goal.description || '',
            targetAmount: FN_UTILS_STRING.formatReaisToMoneyInput(goal.targetAmount),
            targetDate: FN_UTILS_DATE.formatInBusinessTZ(goal.targetDate, 'yyyy-MM-dd'),
          }
        : GoalDefaultValues,
      invalidateKeys: [getGetGoalsQueryKey(), ...freeBalanceQueryKeys()],
      errorFields: ['title', 'description', 'targetAmount', 'targetDate'],
      successMessage: {
        create: 'Meta criada com sucesso',
        update: 'Meta atualizada com sucesso',
      },
      onSaved,
    });

  const createMutation = usePostGoals({
    mutation: { onSuccess: onCreated, onError },
  });

  const updateMutation = usePutGoalsId({
    mutation: { onSuccess: onUpdated, onError },
  });

  const handleForm = (data: GoalFormValues) => {
    const payload = {
      title: data.title,
      description: data.description,
      targetAmount: FN_UTILS_STRING.formatCurrentStringToNumber(data.targetAmount),
      targetDate: FN_UTILS_STRING.formatEndDayDate(data.targetDate),
    };
    if (goal) {
      updateMutation.mutate({ id: goal.id || '', data: payload });
    } else {
      createMutation.mutate({ data: payload });
    }
  };

  return (
    <>
      <DialogCloseHidden />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          <BaseInput
            name="title"
            label="Título"
            control={form.control}
            placeholder="Ex: Reserva de emergência"
            autoFocus
          />
          <BaseTextarea name="description" label="Descrição" control={form.control} />
          <BaseInput
            name="targetAmount"
            label="Valor alvo"
            control={form.control}
            type="money"
            placeholder="0,00"
          />
          <BaseDatePicker name="targetDate" label="Data de término" control={form.control} />
          <DialogFormFooter
            submitLabel={goal ? 'Atualizar' : 'Criar'}
            isLoading={goal ? updateMutation.isPending : createMutation.isPending}
            hideCancel={Boolean(onSaved)}
          />
        </BaseForm>
      </Form>
    </>
  );
};
