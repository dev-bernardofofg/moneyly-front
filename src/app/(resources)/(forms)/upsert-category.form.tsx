"use client"

import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form'
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input'
import { DialogFormFooter } from '@/app/(components)/(bases)/(forms)/dialog-form-footer'
import { useUpsertDialog } from '@/app/(hooks)/use-upsert-dialog'
import { Form } from '@/components/ui/form'
import { getGetCategoriesQueryKey, usePostCategoriesCreate, usePutCategoriesUpdateId } from '../(generated)/hooks/categories/categories'
import { TransactionCategory } from '../(generated)/hooks/moneylyAPI.schemas'
import { CreateCategoryDefaultValues, CreateCategoryFormValues, CreateCategorySchema } from '../(schemas)/category.schema'

interface UpsertCategoryFormProps {
  category?: TransactionCategory
}

export const UpsertCategoryForm = ({ category }: UpsertCategoryFormProps) => {
  const isUpdate = !!category;

  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<CreateCategoryFormValues>({
      schema: CreateCategorySchema,
      defaultValues: isUpdate
        ? (category as CreateCategoryFormValues)
        : CreateCategoryDefaultValues,
      invalidateKeys: [getGetCategoriesQueryKey()],
      errorFields: ['name'],
      successMessage: {
        create: "Categoria criada com sucesso",
        update: "Categoria atualizada com sucesso",
      },
    });

  const createMutation = usePostCategoriesCreate({
    mutation: { onSuccess: onCreated, onError },
  });

  const updateMutation = usePutCategoriesUpdateId({
    mutation: { onSuccess: onUpdated, onError },
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
      <DialogCloseHidden />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          <BaseInput name="name" label="Nome" control={form.control} placeholder="Ex: Alimentação" autoFocus />
          <DialogFormFooter
            submitLabel={isUpdate ? "Atualizar categoria" : "Criar categoria"}
            isLoading={isUpdate ? updateMutation.isPending : createMutation.isPending}
          />
        </BaseForm>
      </Form>
    </>
  );
};
