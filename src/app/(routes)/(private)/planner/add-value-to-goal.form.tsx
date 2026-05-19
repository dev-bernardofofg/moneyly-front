"use client"

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { DialogFormFooter } from "@/app/(components)/(bases)/(forms)/dialog-form-footer"
import { useUpsertDialog } from "@/app/(hooks)/use-upsert-dialog"
import { FN_UTILS_STRING } from "@/app/(helpers)/string"
import { Form } from "@/components/ui/form"
import { usePostGoalsIdAddAmount } from "../../../(resources)/(generated)/hooks/goals/goals"
import { getGetGoalsQueryKey } from "../../../(resources)/(generated)/hooks/goals/goals"
import { AddValueToGoalDefaultValues, AddValueToGoalFormValues, AddValueToGoalSchema } from "../../../(resources)/(schemas)/goal.schema"
import { getGetOverviewPlannerQueryKey } from "@/app/(resources)/(generated)/hooks/overview/overview"

interface AddValueToGoalFormProps {
  goalId: string
}

export const AddValueToGoalForm = ({ goalId }: AddValueToGoalFormProps) => {
  const { form, onCreated, onError, DialogCloseHidden } =
    useUpsertDialog<AddValueToGoalFormValues>({
      schema: AddValueToGoalSchema,
      defaultValues: AddValueToGoalDefaultValues,
      invalidateKeys: [getGetGoalsQueryKey(), getGetOverviewPlannerQueryKey()],
      errorFields: ['amount'],
      successMessage: {
        create: "Valor adicionado com sucesso",
        update: "Valor adicionado com sucesso",
      },
    })

  const { mutate: addValueToGoal, isPending } = usePostGoalsIdAddAmount({
    mutation: { onSuccess: onCreated, onError },
  })

  const handleForm = (data: AddValueToGoalFormValues) => {
    addValueToGoal({
      id: goalId,
      data: {
        amount: FN_UTILS_STRING.formatCurrentStringToNumber(data.amount),
      },
    })
  }

  return (
    <>
      <DialogCloseHidden />
      <Form  {...form}>
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
  )
}
