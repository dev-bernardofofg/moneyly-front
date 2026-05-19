import { DialogFormFooter } from "@/app/(components)/(bases)/(forms)/dialog-form-footer";
import { BaseDatePicker } from "@/app/(components)/(bases)/(forms)/base-date-picker";
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select";
import { BaseTextarea } from "@/app/(components)/(bases)/(forms)/base-textarea";
import { useUpsertDialog } from "@/app/(hooks)/use-upsert-dialog";
import { FN_UTILS_STRING } from "@/app/(helpers)/string";
import { Form } from "@/components/ui/form";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Category, Transaction } from "../(generated)";
import { useGetCategories } from "../(generated)/hooks/categories/categories";
import { getGetOverviewDashboardQueryKey, getGetOverviewPlannerQueryKey } from "../(generated)/hooks/overview/overview";
import { getGetTransactionsQueryKey, getGetTransactionsSummaryQueryKey, usePostTransactionsCreate, usePutTransactionsId } from "../(generated)/hooks/transactions/transactions";
import { UpsertTransactionDefaultValues, UpsertTransactionFormValues, UpsertTransactionSchema } from "../(schemas)/transaction.schema";

export const UpsertTransactionForm = ({ transaction }: { transaction?: Transaction }) => {
  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<UpsertTransactionFormValues>({
      schema: UpsertTransactionSchema,
      defaultValues: transaction ? {
        ...transaction,
        amount: FN_UTILS_STRING.formatReaisToMoneyInputDigits(transaction.amount as string),
        date: transaction.date as string,
        category: transaction.category?.id,
        description: transaction.description as string,
        title: transaction.title as string,
        type: transaction.type as "income" | "expense",
      } : UpsertTransactionDefaultValues,
      invalidateKeys: [
        getGetOverviewDashboardQueryKey(),
        getGetTransactionsQueryKey(),
        getGetTransactionsSummaryQueryKey(),
        getGetOverviewPlannerQueryKey(),
      ],
      errorFields: ['title', 'amount', 'type', 'category', 'date', 'description'],
      successMessage: {
        create: "Transação criada com sucesso",
        update: "Transação atualizada com sucesso",
      },
    });

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();

  const { mutate: createTransaction, isPending } = usePostTransactionsCreate({
    mutation: { onSuccess: onCreated, onError },
  });

  const { mutate: updateTransaction, isPending: isUpdating } = usePutTransactionsId({
    mutation: { onSuccess: onUpdated, onError },
  });

  const handleUpsertTransaction = (data: UpsertTransactionFormValues) => {
    if (transaction) {
      updateTransaction({
        id: transaction.id as string,
        data: {
          ...data,
          amount: FN_UTILS_STRING.formatCurrentStringToNumber(data.amount),
        },
      });
    } else {
      createTransaction({
        data: {
          ...data,
          amount: FN_UTILS_STRING.formatCurrentStringToNumber(data.amount),
          category: data.category || '',
        },
      });
    }
  };

  return (
    <>
      <DialogCloseHidden />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleUpsertTransaction)}>
          <BaseInput control={form.control} name="title" label="Título" placeholder="Ex: Mercado" autoFocus />
          <div className="grid grid-cols-2 gap-2">
            <Controller
              control={form.control}
              name="type"
              render={({ field }) => (
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Tipo</span>
                  <div
                    className={cn(
                      "relative grid grid-cols-2 rounded-lg border overflow-hidden h-11 p-0.5 gap-0.5 transition-colors duration-300",
                      field.value === "income"
                        ? "border-income/60 bg-income/5"
                        : "border-expense/60 bg-expense/5"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => field.onChange("income")}
                      className={cn(
                        "relative flex items-center justify-center gap-1.5 rounded-md text-sm font-semibold transition-all duration-300",
                        field.value === "income"
                          ? "bg-income text-income-foreground shadow-sm shadow-income/40"
                          : "text-muted-foreground hover:text-foreground hover:bg-income/10"
                      )}
                    >
                      <TrendingUp className="size-3.5 shrink-0" />
                      Entrada
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("expense")}
                      className={cn(
                        "relative flex items-center justify-center gap-1.5 rounded-md text-sm font-semibold transition-all duration-300",
                        field.value === "expense"
                          ? "bg-expense text-expense-foreground shadow-sm shadow-expense/40"
                          : "text-muted-foreground hover:text-foreground hover:bg-expense/10"
                      )}
                    >
                      <TrendingDown className="size-3.5 shrink-0" />
                      Saída
                    </button>
                  </div>
                </div>
              )}
            />
            <BaseSelect control={form.control} name="category" label="Categoria" isLoading={isLoadingCategories} emptyMessage="Nenhuma categoria. Crie em Categorias." options={categories?.data?.map((category: Category) => ({ label: category.name || '', value: category.id || '' })) || []} />
          </div>
          <BaseInput control={form.control} name="amount" label="Valor" type="money" placeholder="0,00" />
          <BaseTextarea control={form.control} name="description" label="Descrição" />
          <BaseDatePicker control={form.control} name="date" label="Data" />

          <DialogFormFooter
            submitLabel={transaction ? "Atualizar" : "Criar"}
            isLoading={isPending || isUpdating}
          />
        </BaseForm>
      </Form>
    </>
  );
};