import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { BaseDatePicker } from "@/app/(components)/(bases)/(forms)/base-date-picker";
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select";
import { BaseTextarea } from "@/app/(components)/(bases)/(forms)/base-textarea";
import { getErrorMessage } from "@/app/(helpers)/errors";
import { FN_UTILS_STRING } from "@/app/(helpers)/string";
import { CustomAxiosError } from "@/app/(types)/error.type";
import { DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { BrushCleaning } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Category, Transaction } from "../(generated)";
import { useGetCategories } from "../(generated)/hooks/categories/categories";
import { getGetOverviewPlannerQueryKey } from "../(generated)/hooks/overview/overview";
import { getGetTransactionsSummaryQueryKey, usePostTransactionsCreate, usePutTransactionsId } from "../(generated)/hooks/transactions/transactions";
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

  const { data: categories } = useGetCategories({
    page: 1,
    limit: 10,
  });

  const { mutate: createTransaction, isPending } = usePostTransactionsCreate({
    mutation: {
      onSuccess: () => {
        if (transaction) {
          toast.success("Transação atualizada com sucesso");
        } else {
          toast.success("Transação criada com sucesso");
        }
        queryClient.invalidateQueries({ queryKey: [getGetTransactionsSummaryQueryKey()] });
        queryClient.invalidateQueries({ queryKey: [getGetOverviewPlannerQueryKey()] });
        form.reset();
        closeRef.current?.click();
      },
      onError: (error: CustomAxiosError) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      },
    },
  });

  const { mutate: updateTransaction, isPending: isUpdating } = usePutTransactionsId({
    mutation: {
      onSuccess: () => {
        toast.success("Transação atualizada com sucesso");
        queryClient.invalidateQueries({ queryKey: [getGetTransactionsSummaryQueryKey()] });
        closeRef.current?.click();
      },
      onError: (error: CustomAxiosError) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
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
            <BaseSelect
              control={form.control}
              name="type"
              label="Tipo"
              options={[
                { label: "Entrada", value: "income" },
                { label: "Saída", value: "expense" }
              ]}
            />
            <BaseSelect control={form.control} name="category" label="Categoria" options={categories?.data.data?.map((category: Category) => ({ label: category.name || '', value: category.id || '' })) || []} />
          </div>
          <BaseInput control={form.control} name="amount" label="Valor" type="money" placeholder="0,00" />
          <BaseTextarea control={form.control} name="description" label="Descrição" />
          <BaseDatePicker control={form.control} name="date" label="Data" />

          <div className="flex items-center justify-between gap-3">
            <BaseButton type="button" className="w-fit" variant="destructive" onClick={() => form.reset()}>
              <BrushCleaning />
            </BaseButton>
            <BaseButton type="submit" isLoading={isPending || isUpdating}>{transaction ? "Atualizar" : "Criar"}</BaseButton>
          </div>
        </BaseForm>
      </Form>
    </>
  );
};