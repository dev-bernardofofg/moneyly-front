'use client';

import { BaseForm } from '@/components/forms/base-form';
import { BaseInput } from '@/components/forms/base-input';
import { DialogFormFooter } from '@/components/forms/dialog-form-footer';
import { useUpsertDialog } from '@/hooks/use-upsert-dialog';
import { FN_UTILS_STRING } from '@/lib/string';
import { Form } from '@/components/ui/form';
import { usePostGoalsIdAddAmount } from '@/api/generated/hooks/goals/goals';
import { getGetGoalsQueryKey } from '@/api/generated/hooks/goals/goals';
import {
  AddValueToGoalDefaultValues,
  AddValueToGoalFormValues,
  AddValueToGoalSchema,
} from '@/schemas/goal.schema';
import { freeBalanceQueryKeys } from '@/api/free-balance-query-keys';
import { getGetNotificationsQueryKey } from '@/api/generated/hooks/notifications/notifications';
import type { Goal } from '@/api/generated/types/Goal';
import { toast } from 'sonner';

const MILESTONES = [25, 50, 75, 100] as const;

const goalPercentage = (goal: Goal) => {
  const target = Number(goal.targetAmount);
  if (!Number.isFinite(target) || target <= 0) return 0;
  return (Number(goal.currentAmount || 0) / target) * 100;
};

interface AddValueToGoalFormProps {
  goal: Goal;
}

export const AddValueToGoalForm = ({ goal }: AddValueToGoalFormProps) => {
  const { form, onCreated, onError, DialogCloseHidden } = useUpsertDialog<AddValueToGoalFormValues>(
    {
      schema: AddValueToGoalSchema,
      defaultValues: AddValueToGoalDefaultValues,
      invalidateKeys: [
        getGetGoalsQueryKey(),
        ...freeBalanceQueryKeys(),
        // F9: o marco (goal_milestone) já existe quando a resposta chega — refresca o sino.
        getGetNotificationsQueryKey(),
      ],
      errorFields: ['amount'],
      successMessage: {
        create: 'Valor adicionado com sucesso',
        update: 'Valor adicionado com sucesso',
      },
    }
  );

  // F9: o back notifica cada marco recém-atingido no sino; aqui só o toast imediato
  // do maior marco cruzado, calculado da própria resposta (o openapi tipa a resposta
  // como Goal puro, sem a lista de milestones — comparar % antes/depois equivale).
  const celebrateMilestone = (updated: Goal) => {
    const before = goalPercentage(goal);
    const after = goalPercentage(updated);
    const crossed = MILESTONES.filter((m) => before < m && after >= m).pop();
    if (!crossed) return;
    if (crossed === 100) {
      toast.success(`Meta concluída: ${updated.title}. Parabéns!`, { duration: 8000 });
    } else {
      toast.success(`Meta "${updated.title}": ${crossed}% atingido`);
    }
  };

  const { mutate: addValueToGoal, isPending } = usePostGoalsIdAddAmount({
    mutation: {
      onSuccess: (res) => {
        onCreated();
        celebrateMilestone(res.data);
      },
      onError,
    },
  });

  const handleForm = (data: AddValueToGoalFormValues) => {
    addValueToGoal({
      id: goal.id,
      data: {
        amount: FN_UTILS_STRING.formatCurrentStringToNumber(data.amount),
      },
    });
  };

  return (
    <>
      <DialogCloseHidden />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          <BaseInput
            name="amount"
            label="Valor"
            control={form.control}
            type="money"
            placeholder="0,00"
            autoFocus
          />
          <DialogFormFooter submitLabel="Adicionar" isLoading={isPending} />
        </BaseForm>
      </Form>
    </>
  );
};
