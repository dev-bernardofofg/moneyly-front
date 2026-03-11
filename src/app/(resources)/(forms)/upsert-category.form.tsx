"use client"

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button'
import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form'
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input'
import { queryClient } from '@/app/(contexts)'
import { getErrorMessage, setFormFieldErrors } from '@/app/(helpers)/errors'
import { CustomAxiosError } from '@/app/(types)/error.type'
import { DialogClose } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getGetCategoriesQueryKey, usePostCategoriesCreate, usePutCategoriesUpdateId } from '../(generated)/hooks/categories/categories'
import { TransactionCategory } from '../(generated)/hooks/moneylyAPI.schemas'
import { CreateCategoryDefaultValues, CreateCategoryFormValues, CreateCategorySchema } from '../(schemas)/category.schema'

interface UpsertCategoryFormProps {
  category?: TransactionCategory
}

export const UpsertCategoryForm = ({ category }: UpsertCategoryFormProps) => {
  const isUpdate = !!category;

  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: isUpdate ? category : CreateCategoryDefaultValues,
  })

  const createMutation = usePostCategoriesCreate({
    mutation: {
      onSuccess: () => {
        toast.success("Categoria criada com sucesso");
        form.reset();
        closeRef.current?.click();
        queryClient.invalidateQueries({ queryKey: [getGetCategoriesQueryKey()] });
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
        setFormFieldErrors(error, form.setError, ['name']);
      },
    },
  });

  const updateMutation = usePutCategoriesUpdateId({
    mutation: {
      onSuccess: () => {
        toast.success("Categoria atualizada com sucesso");
        form.reset();
        closeRef.current?.click();
        queryClient.invalidateQueries({ queryKey: [getGetCategoriesQueryKey()] });
      },
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
        setFormFieldErrors(error, form.setError, ['name']);
      },
    },
  });

  const handleForm = (data: CreateCategoryFormValues) => {
    if (isUpdate) {
      updateMutation.mutate({ id: category?.id || '', data: { name: data.name } })
    } else {
      createMutation.mutate({ data: { name: data.name } })
    }
  }

  return (
    <>
      <DialogClose ref={closeRef} className="hidden" />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          <BaseInput name="name" label="Nome" control={form.control} />
          <BaseButton
            type="submit"
            isLoading={isUpdate ? updateMutation.isPending : createMutation.isPending}
          >
            {isUpdate ? "Atualizar categoria" : "Criar categoria"}
          </BaseButton>
        </BaseForm>
      </Form>
    </>
  );
};
