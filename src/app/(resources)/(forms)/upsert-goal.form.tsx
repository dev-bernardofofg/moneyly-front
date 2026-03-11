"use client"

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button"
import { BaseDatePicker } from "@/app/(components)/(bases)/(forms)/base-date-picker"
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { BaseTextarea } from "@/app/(components)/(bases)/(forms)/base-textarea"
import { getErrorMessage } from "@/app/(helpers)/errors"
import { FN_UTILS_STRING } from "@/app/(helpers)/string"
import { CustomAxiosError } from "@/app/(types)/error.type"
import { DialogClose } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Goal } from "../(generated)"
import { getGetGoalsQueryKey, usePostGoals, usePutGoalsId } from "../(generated)/hooks/goals/goals"
import { getGetOverviewPlannerQueryKey } from "../(generated)/hooks/overview/overview"
import { GoalDefaultValues, GoalFormValues, GoalSchema } from "../(schemas)/goal.schema"

interface UpsertGoalFormProps {
  goal?: Goal
}

export const UpsertGoalForm = ({ goal }: UpsertGoalFormProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(GoalSchema),
    defaultValues: goal ? {
      title: goal.title || "",
      description: goal.description || "",
      targetAmount: goal.targetAmount?.toString() || "",
      targetDate: goal.targetDate,
    } : GoalDefaultValues,
  })

  const createMutation = usePostGoals({
    mutation: {
      onSuccess: () => {
        toast.success("Meta criada com sucesso");
        closeRef.current?.click();
        queryClient.invalidateQueries({ queryKey: getGetGoalsQueryKey() });
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetOverviewPlannerQueryKey() });
      },
    }
  });

  const updateMutation = usePutGoalsId({
    mutation: {
      onSuccess: () => {
        toast.success("Meta atualizada com sucesso");
        closeRef.current?.click();
        queryClient.invalidateQueries({ queryKey: getGetGoalsQueryKey() });
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: getGetOverviewPlannerQueryKey() });
      },
    }
  });

  const handleForm = (data: GoalFormValues) => {
    if (goal) {
      updateMutation.mutate({ id: goal.id || "", data: { title: data.title, description: data.description, targetAmount: FN_UTILS_STRING.formatCurrentStringToNumber(data.targetAmount), targetDate: FN_UTILS_STRING.formatEndDayDate(data.targetDate) } });
    } else {
      createMutation.mutate({ data: { title: data.title, description: data.description, targetAmount: FN_UTILS_STRING.formatCurrentStringToNumber(data.targetAmount), targetDate: FN_UTILS_STRING.formatEndDayDate(data.targetDate) } });
    }
  }

  return (
    <>
      <DialogClose ref={closeRef} className="hidden" />
      <Form  {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          <BaseInput name="title" label="Título" control={form.control} />
          <BaseTextarea name="description" label="Descrição" control={form.control} />
          <BaseInput name="targetAmount" label="Valor alvo" control={form.control} type="money" placeholder="0,00" />
          <BaseDatePicker name="targetDate" label="Data de término" control={form.control} />
          <BaseButton type="submit" isLoading={createMutation.isPending}>
            {goal ? "Atualizar" : "Criar"}
          </BaseButton>
        </BaseForm>
      </Form>
    </>
  )
} 
