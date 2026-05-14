import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { BaseDatePicker } from "@/app/(components)/(bases)/(forms)/base-date-picker";
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select";
import { BaseTextarea } from "@/app/(components)/(bases)/(forms)/base-textarea";
import { getErrorMessage, setFormFieldErrors } from "@/app/(helpers)/errors";
import { FN_UTILS_STRING } from "@/app/(helpers)/string";
import { CustomAxiosError } from "@/app/(types)/error.type";
import { DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { BrushCleaning, TrendingDown, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Category, Transaction } from "../(generated)";
import { useGetCategories } from "../(generated)/hooks/categories/categories";
import { getGetOverviewDashboardQueryKey, getGetOverviewPlannerQueryKey } from "../(generated)/hooks/overview/overview";
import { getGetTransactionsQueryKey, getGetTransactionsSummaryQueryKey, usePostTransactionsCreate, usePutTransactionsId } from "../(generated)/hooks/transactions/transactions";
import { UpsertTransactionDefaultValues, UpsertTransactionFormValues, UpsertTransactionSchema } from "../(schemas)/transaction.schema";

export const UpsertTransactionForm = ({ transaction }: { transaction?: Transaction }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  
  const form = useForm<UpsertTransactionFormValues>({
    resolver: zodResolver(UpsertTransactionSchema),
    defaultValues: transaction ? {
      ...transaction,
      amount: FN_UTILS_STRING.formatDotToComma(transaction.amount as string),
      date: transaction.date as string,
      category: transaction.category?.id,
      description: transaction.description as string,
      title: transaction.title as string,
      type: transaction.type as "income" | "expense",
    } : UpsertTransactionDefaultValues,
  });

  const { data: categories, isLoading: isLoadingCategories } = useGetCategories();

  const { mutate: createTransaction, isPending } = usePostTransactionsCreate({
    mutation: {
      onSuccess: () => {
        toast.success("Transação criada com sucesso");
        queryClient.invalidateQueries({ queryKey: getGetOverviewDashboardQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTransactionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: [getGetTransactionsSummaryQueryKey()] });
        queryClient.invalidateQueries({ queryKey: [getGetOverviewPlannerQueryKey()] });
        form.reset();
        closeRef.current?.click();
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
        setFormFieldErrors(error, form.setError, ['title', 'amount', 'type', 'category', 'date', 'description']);
      },
    },
  });

  const { mutate: updateTransaction, isPending: isUpdating } = usePutTransactionsId({
    mutation: {
      onSuccess: () => {
        toast.success("Transação atualizada com sucesso");
        queryClient.invalidateQueries({ queryKey: getGetOverviewDashboardQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTransactionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: [getGetTransactionsSummaryQueryKey()] });
        queryClient.invalidateQueries({ queryKey: [getGetOverviewPlannerQueryKey()] });
        closeRef.current?.click();
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
        setFormFieldErrors(error, form.setError, ['title', 'amount', 'type', 'category', 'date', 'description']);
      },
    },
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
      <DialogClose ref={closeRef} className="hidden" />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleUpsertTransaction)}>
          <BaseInput control={form.control} name="title" label="Título" autoFocus />
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
                        ? "border-green-500/60 bg-green-500/5"
                        : "border-red-500/60 bg-red-500/5"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => field.onChange("income")}
                      className={cn(
                        "relative flex items-center justify-center gap-1.5 rounded-md text-sm font-semibold transition-all duration-300",
                        field.value === "income"
                          ? "bg-green-500 text-white shadow-sm shadow-green-500/40"
                          : "text-muted-foreground hover:text-foreground hover:bg-green-500/10"
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
                          ? "bg-red-500 text-white shadow-sm shadow-red-500/40"
                          : "text-muted-foreground hover:text-foreground hover:bg-red-500/10"
                      )}
                    >
                      <TrendingDown className="size-3.5 shrink-0" />
                      Saída
                    </button>
                  </div>
                </div>
              )}
            />
            <BaseSelect control={form.control} name="category" label="Categoria" isLoading={isLoadingCategories} options={categories?.data?.map((category: Category) => ({ label: category.name || '', value: category.id || '' })) || []} />
          </div>
          <BaseInput control={form.control} name="amount" label="Valor" type="money" placeholder="0,00" />
          <BaseTextarea control={form.control} name="description" label="Descrição" />
          <BaseDatePicker control={form.control} name="date" label="Data" />

          <div className="flex items-center justify-between gap-3">
            <BaseButton type="button" className="w-fit" variant="destructive" onClick={() => form.reset()}>
              <BrushCleaning />
            </BaseButton>
            <BaseButton type="submit" className="w-full" isLoading={isPending || isUpdating}>{transaction ? "Atualizar" : "Criar"}</BaseButton>
          </div>
        </BaseForm>
      </Form>
    </>
  );
};