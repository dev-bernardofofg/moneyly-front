'use client';

import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form';
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input';
import { DialogFormFooter } from '@/app/(components)/(bases)/(forms)/dialog-form-footer';
import { useUpsertDialog } from '@/app/(hooks)/use-upsert-dialog';
import { FN_UTILS_STRING } from '@/app/(helpers)/string';
import { Form } from '@/components/ui/form';
import { usePostGoalsIdAddAmount } from '../../../(resources)/(generated)/hooks/goals/goals';
import { getGetGoalsQueryKey } from '../../../(resources)/(generated)/hooks/goals/goals';
import {
  AddValueToGoalDefaultValues,
  AddValueToGoalFormValues,
  AddValueToGoalSchema,
} from '../../../(resources)/(schemas)/goal.schema';
import { getGetOverviewPlannerQueryKey } from '@/app/(resources)/(generated)/hooks/overview/overview';
import { getGetNotificationsQueryKey } from '@/app/(resources)/(generated)/hooks/notifications/notifications';
import type { Goal } from '@/app/(resources)/(generated)/types/Goal';
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
        getGetOverviewPlannerQueryKey(),
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
