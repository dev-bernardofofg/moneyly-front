import { BaseDatePicker } from "@/app/(components)/(bases)/(forms)/base-date-picker";
import { BaseForm } from "@/app/(components)/(bases)/(forms)/base-form";
import { BaseInput } from "@/app/(components)/(bases)/(forms)/base-input";
import { BaseSelect } from "@/app/(components)/(bases)/(forms)/base-select";
import { BaseTextarea } from "@/app/(components)/(bases)/(forms)/base-textarea";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { getErrorMessage } from "@/app/(helpers)/errors";
import { GetCategoriesRequest } from "@/app/(services)/category.service";
import { overviewQueryData } from "@/app/(services)/overview.service";
import { CreateTransactionRequest } from "@/app/(services)/transaction.service";
import { DialogClose } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { BrushCleaning } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { UpsertTransactionDefaultValues, UpsertTransactionFormValues, UpsertTransactionSchema } from "../(schemas)/transaction.schema";

export const UpsertTransactionForm = () => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const queryClient = useQueryClient();
  const form = useForm<UpsertTransactionFormValues>({
    resolver: zodResolver(UpsertTransactionSchema),
    defaultValues: UpsertTransactionDefaultValues,
  });

  const { data: categories } = GetCategoriesRequest();

  const { mutate, isPending } = CreateTransactionRequest({
    onSuccess: () => {
      toast.success("Transação criada com sucesso");
      form.reset();
      closeRef.current?.click();
      queryClient.invalidateQueries({ queryKey: [overviewQueryData.getOverview] });
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    },
  });

  const handleUpsertTransaction = (data: UpsertTransactionFormValues) => {
    const payload = {
      ...data,
      amount: Number(data.amount),
    }

    mutate(payload);
  };

  return (
    <>
      <DialogClose ref={closeRef} className="hidden" />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleUpsertTransaction)}>
          <BaseInput control={form.control} name="title" label="Título" autoFocus />
          <BaseSelect
            control={form.control}
            name="type"
            label="Tipo"
            options={[
              { label: "Entrada", value: "income" },
              { label: "Saída", value: "expense" }
            ]}
          />
          <BaseInput control={form.control} name="amount" label="Valor" />
          <BaseSelect control={form.control} name="category" label="Categoria" options={categories?.map((category) => ({ label: category.name, value: category.id })) || []} />
          <BaseTextarea control={form.control} name="description" label="Descrição" />
          <BaseDatePicker control={form.control} name="date" label="Data" />

          <div className="flex items-center justify-between gap-3">
            <BaseButton type="button" className="w-fit" variant="destructive" onClick={() => form.reset()}>
              <BrushCleaning />
            </BaseButton>
            <BaseButton type="submit" isLoading={isPending}>Salvar</BaseButton>
          </div>
        </BaseForm>
      </Form>
    </>
  );
};