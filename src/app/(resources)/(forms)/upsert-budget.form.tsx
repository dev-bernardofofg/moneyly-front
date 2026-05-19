"use client"

import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form"
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input"
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select"
import { DialogFormFooter } from "@/app/(components)/(bases)/(forms)/dialog-form-footer"
import { useUpsertDialog } from "@/app/(hooks)/use-upsert-dialog"
import { FN_UTILS_STRING } from "@/app/(helpers)/string"
import { Form } from "@/components/ui/form"
import { BudgetProgress } from "../(generated)"
import { getGetBudgetsQueryKey, usePostBudgets, usePutBudgetsId } from "../(generated)/hooks/budgets/budgets"
import { useGetCategories } from "../(generated)/hooks/categories/categories"
import { getGetOverviewDashboardQueryKey, getGetOverviewPlannerQueryKey } from "../(generated)/hooks/overview/overview"
import { CreateBudgetDefaultValues, CreateBudgetFormValues, CreateBudgetSchema } from "../(schemas)/budget.schema"
import { TransactionCategory } from "../(generated)/hooks/moneylyAPI.schemas"

interface UpsertBudgetFormProps {
  budget?: BudgetProgress
}

export const UpsertBudgetForm = ({ budget }: UpsertBudgetFormProps) => {
  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<CreateBudgetFormValues>({
      schema: CreateBudgetSchema,
      defaultValues: budget ? {
        categoryId: budget.category?.id || "",
        monthlyLimit: FN_UTILS_STRING.formatReaisToMoneyInputDigits(budget.monthlyLimit ?? undefined),
      } : CreateBudgetDefaultValues,
      invalidateKeys: [
        getGetBudgetsQueryKey(),
        getGetOverviewPlannerQueryKey(),
        getGetOverviewDashboardQueryKey(),
      ],
      errorFields: ['categoryId', 'monthlyLimit'],
      successMessage: {
        create: "Orçamento criado com sucesso",
        update: "Orçamento atualizado com sucesso",
      },
    })

  const createMutation = usePostBudgets({
    mutation: { onSuccess: onCreated, onError },
  });

  const updateMutation = usePutBudgetsId({
    mutation: { onSuccess: onUpdated, onError },
  });

  const { data: categories } = useGetCategories()

  const handleForm = (data: CreateBudgetFormValues) => {
    if (budget) {
      updateMutation.mutate({
        id: budget.id || "", data: { monthlyLimit: FN_UTILS_STRING.formatCurrentStringToNumber(data.monthlyLimit) } })
    } else {
      createMutation.mutate({ data: { categoryId: data.categoryId || "", monthlyLimit: FN_UTILS_STRING.formatCurrentStringToNumber(data.monthlyLimit) } })
    }
  }

  return (
    <>
      <DialogCloseHidden />
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
            emptyMessage="Nenhuma categoria. Crie em Categorias."
            disabled={!!budget}
          />
          <BaseInput name="monthlyLimit" label="Limite mensal" control={form.control} type="money" placeholder="0,00" />
          <DialogFormFooter
            submitLabel={budget ? "Atualizar" : "Criar"}
            isLoading={budget ? updateMutation.isPending : createMutation.isPending}
          />
        </BaseForm>
      </Form>
    </>
  )
}
