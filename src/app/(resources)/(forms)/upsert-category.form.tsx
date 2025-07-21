"use client"

import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form'
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input'
import { BaseButton } from '@/app/(components)/(bases)/base-button'
import { queryClient } from '@/app/(contexts)'
import { getErrorMessage } from '@/app/(helpers)/errors'
import { categoryQueryData, CreateCategoryRequest, UpdateCategoryRequest } from '@/app/(services)/category.service'
import { Category } from '@/app/(types)/category'
import { DialogClose } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CreateCategoryDefaultValues, CreateCategoryFormValues, CreateCategorySchema } from '../(schemas)/category.schema'

interface UpsertCategoryFormProps {
  category?: Category
}

export const UpsertCategoryForm = ({ category }: UpsertCategoryFormProps) => {
  const isUpdate = !!category;

  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: isUpdate ? category : CreateCategoryDefaultValues,
  })

  const createMutation = CreateCategoryRequest({
    onSuccess: () => {
      toast.success("Categoria criada com sucesso");
      form.reset();
      closeRef.current?.click();
      queryClient.invalidateQueries({ queryKey: [categoryQueryData.getCategories] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const updateMutation = UpdateCategoryRequest({
    onSuccess: () => {
      toast.success("Categoria atualizada com sucesso");
      form.reset();
      closeRef.current?.click();
      queryClient.invalidateQueries({ queryKey: [categoryQueryData.getCategories] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handleForm = (data: CreateCategoryFormValues) => {
    if (isUpdate) {
      updateMutation.mutate({ id: category?.id || '', name: data.name })
    } else {
      createMutation.mutate({ name: data.name })
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
