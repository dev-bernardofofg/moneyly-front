"use client"

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { BaseButton } from "@/app/(components)/(bases)/base-button"
import { queryClient } from "@/app/(contexts)"
import { getErrorMessage } from "@/app/(helpers)/errors"
import { FN_UTILS_STRING } from "@/app/(helpers)/string"
import { AddValueToGoal, goalQueryData } from "@/app/(services)/goal.service"
import { DialogClose } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { AddValueToGoalFormValues, AddValueToGoalSchema } from "../(schemas)/goal.schema"
interface AddValueToGoalFormProps {
  goalId: string
}

export const AddValueToGoalForm = ({ goalId }: AddValueToGoalFormProps) => {
  const closeRef = useRef<HTMLButtonElement>(null)

  const form = useForm<AddValueToGoalFormValues>({
    resolver: zodResolver(AddValueToGoalSchema),
  })

  const { mutate: addValueToGoal, isPending } = AddValueToGoal({
    onSuccess: () => {
      toast.success("Valor adicionado com sucesso")
      closeRef.current?.click()
      queryClient.invalidateQueries({ queryKey: [goalQueryData.getGoals] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    }
  })


  const handleForm = (data: AddValueToGoalFormValues) => {
    addValueToGoal({
      goalId,
      amount: FN_UTILS_STRING.formatCurrentStringToNumber(data.amount),
    })
  }

  return (
    <>
      <DialogClose ref={closeRef} className="hidden" />
      <Form  {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          <BaseInput
            name="amount"
            label="Valor"
            control={form.control}
            type="money"
            placeholder="0,00"
          />
          <BaseButton
            type="submit"
            className="w-full"
            isLoading={isPending}
          >
            Adicionar
          </BaseButton>
        </BaseForm>
      </Form>
    </>
  )
}
