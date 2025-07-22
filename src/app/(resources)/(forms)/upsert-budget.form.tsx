"use client"

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select"
import { BaseButton } from "@/app/(components)/(bases)/base-button"
import { getErrorMessage } from "@/app/(helpers)/errors"
import { FN_UTILS_STRING } from "@/app/(helpers)/string"
import { budgetQueryData, CreateBudget, GetBudgets, UpdateBudget } from "@/app/(services)/budget.service"
import { GetCategoriesRequest } from "@/app/(services)/category.service"
import { Budget } from "@/app/(types)/budget"
import { DialogClose } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useMemo, useRef } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
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
      categoryId: budget.category.id,
      monthlyLimit: budget.monthlyLimit.toString(),
    } : CreateBudgetDefaultValues,
  })

  const createMutation = CreateBudget({
    onSuccess: () => {
      toast.success("Orçamento criado com sucesso");
      closeRef.current?.click();
      queryClient.invalidateQueries({ queryKey: [budgetQueryData.getBudgets] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateMutation = UpdateBudget({
    onSuccess: () => {
      toast.success("Orçamento atualizado com sucesso");
      closeRef.current?.click();
      queryClient.invalidateQueries({ queryKey: [budgetQueryData.getBudgets] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const { data: categories } = GetCategoriesRequest()
  const { data: budgets } = GetBudgets()

  // Filtra categorias que já possuem orçamento (exceto a categoria atual se estiver editando)
  const availableCategories = useMemo(() => {
    if (!categories?.data.categories || !budgets?.data) return [];

    const categoriesWithBudget = budgets.data.map(budget => budget.category.id);

    return categories.data.categories.map(category => ({
      label: category.name,
      value: category.id,
      available: budget ?
        category.id === budget.category.id || !categoriesWithBudget.includes(category.id) :
        !categoriesWithBudget.includes(category.id)
    }));
  }, [categories, budgets, budget]);

  const handleForm = (data: CreateBudgetFormValues) => {
    if (budget) {
      updateMutation.mutate({ id: budget.id, monthlyLimit: FN_UTILS_STRING.formatCurrentStringToNumber(data.monthlyLimit) })
    } else {
      createMutation.mutate({ categoryId: data.categoryId, monthlyLimit: FN_UTILS_STRING.formatCurrentStringToNumber(data.monthlyLimit) })
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
            options={availableCategories}
            placeholder={budget ? undefined : "Selecione uma categoria disponível"}
          />
          {!budget && availableCategories.some(cat => !cat.available) && (
            <p className="text-xs text-muted-foreground">
              Categorias com orçamento já existente estão desabilitadas
            </p>
          )}
          <BaseInput name="monthlyLimit" label="Limite mensal" control={form.control} type="money" placeholder="0,00" />
          <BaseButton type="submit" isLoading={budget ? updateMutation.isPending : createMutation.isPending}>
            {budget ? "Atualizar" : "Criar"}
          </BaseButton>
        </BaseForm>
      </Form>
    </>
  )
}
