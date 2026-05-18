"use client"

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button"
import { BaseDatePicker } from "@/app/(components)/(bases)/(forms)/base-date-picker"
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { BaseTextarea } from "@/app/(components)/(bases)/(forms)/base-textarea"
import { useUpsertDialog } from "@/app/(hooks)/use-upsert-dialog"
import { FN_UTILS_STRING } from "@/app/(helpers)/string"
import { Form } from "@/components/ui/form"
import { Goal } from "../(generated)"
import { getGetGoalsQueryKey, usePostGoals, usePutGoalsId } from "../(generated)/hooks/goals/goals"
import { getGetOverviewPlannerQueryKey } from "../(generated)/hooks/overview/overview"
import { GoalDefaultValues, GoalFormValues, GoalSchema } from "../(schemas)/goal.schema"

interface UpsertGoalFormProps {
  goal?: Goal
}

export const UpsertGoalForm = ({ goal }: UpsertGoalFormProps) => {
  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<GoalFormValues>({
      schema: GoalSchema,
      defaultValues: goal ? {
        title: goal.title || "",
        description: goal.description || "",
        targetAmount: FN_UTILS_STRING.formatReaisToMoneyInputDigits(goal.targetAmount),
        targetDate: goal.targetDate,
      } : GoalDefaultValues,
      invalidateKeys: [getGetGoalsQueryKey(), getGetOverviewPlannerQueryKey()],
      errorFields: ['title', 'description', 'targetAmount', 'targetDate'],
      successMessage: {
        create: "Meta criada com sucesso",
        update: "Meta atualizada com sucesso",
      },
    })

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
      updateMutation.mutate({ id: goal.id || "", data: payload });
    } else {
      createMutation.mutate({ data: payload });
    }
  }

  return (
    <>
      <DialogCloseHidden />
      <Form  {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          <BaseInput name="title" label="Título" control={form.control} placeholder="Ex: Reserva de emergência" autoFocus />
          <BaseTextarea name="description" label="Descrição" control={form.control} />
          <BaseInput name="targetAmount" label="Valor alvo" control={form.control} type="money" placeholder="0,00" />
          <BaseDatePicker name="targetDate" label="Data de término" control={form.control} />
          <BaseButton type="submit" className="w-full" isLoading={goal ? updateMutation.isPending : createMutation.isPending}>
            {goal ? "Atualizar" : "Criar"}
          </BaseButton>
        </BaseForm>
      </Form>
    </>
  )
}
