"use client"

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button"
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select"
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
import { Budget } from "../(generated)"
import { usePostBudgets, usePutBudgetsId } from "../(generated)/hooks/budgets/budgets"
import { useGetCategories } from "../(generated)/hooks/categories/categories"
import { TransactionCategory } from "../(generated)/hooks/moneylyAPI.schemas"
import { CreateBudgetDefaultValues, CreateBudgetFormValues, CreateBudgetSchema } from "../(schemas)/budget.schema"

interface UpsertBudgetFormProps {
  budget?: Budget
}

export const UpsertBudgetForm = ({ budget }: UpsertBudgetFormProps) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const form = useForm<CreateBudgetFormValues>({
    resolver: zodResolver(CreateBudgetSchema as any),
    defaultValues: budget ? {
      categoryId: budget.category?.id || "",
      monthlyLimit: budget.monthlyLimit?.toString() || "",
    } : CreateBudgetDefaultValues,
  })

  const createMutation = usePostBudgets({
    mutation: {
      onSuccess: () => {
        toast.success("Orçamento criado com sucesso");
        closeRef.current?.click();
        queryClient.invalidateQueries({ queryKey: ["getBudgets"] });
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  const updateMutation = usePutBudgetsId({
    mutation: {
      onSuccess: () => {
        toast.success("Orçamento atualizado com sucesso");
        closeRef.current?.click();
        queryClient.invalidateQueries({ queryKey: ["getBudgets"] });
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  const { data: categories } = useGetCategories({
    page: 1,
    limit: 1000,
  })

  const handleForm = (data: CreateBudgetFormValues) => {
    if (budget) {
      updateMutation.mutate({ id: budget.id || "", data: { monthlyLimit: FN_UTILS_STRING.formatCurrentStringToNumber(data.monthlyLimit) } })
    } else {
      createMutation.mutate({ data: { categoryId: data.categoryId || "", monthlyLimit: FN_UTILS_STRING.formatCurrentStringToNumber(data.monthlyLimit) } })
    }
  }

  return (
    <>
      <DialogClose ref={closeRef} className="hidden" />
      <Form  {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          <BaseSelect
            name="categoryId"
            label="Categoria"
            control={form.control}
            options={categories?.data?.map((category: TransactionCategory) => ({
              label: category.name || "Nome da categoria",
              value: category.id || "ID da categoria",
            }))}
            placeholder={budget ? undefined : "Selecione uma categoria disponível"}
          />
          <BaseInput name="monthlyLimit" label="Limite mensal" control={form.control} type="money" placeholder="0,00" />
          <BaseButton type="submit" isLoading={budget ? updateMutation.isPending : createMutation.isPending}>
            {budget ? "Atualizar" : "Criar"}
          </BaseButton>
        </BaseForm>
      </Form>
    </>
  )
}
