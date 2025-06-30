"use client"

import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form'
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input'
import { BaseButton } from '@/app/(components)/(bases)/base-button'
import { queryClient } from '@/app/(contexts)'
import { categoryQueryData, CreateCategoryRequest } from '@/app/(services)/category.service'
import { DialogClose } from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CreateCategoryDefaultValues, CreateCategoryFormValues, CreateCategorySchema } from '../(schemas)/category.schema'

export const CreateCategoryForm = () => {
  const closeRef = useRef<HTMLButtonElement>(null);

  const form = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: CreateCategoryDefaultValues,
  })

  const { mutate, isPending } = CreateCategoryRequest({
    onSuccess: () => {
      toast.success("Categoria criada com sucesso");
      form.reset();
      closeRef.current?.click();
      queryClient.invalidateQueries({ queryKey: [categoryQueryData.getCategories] });
    },
    onError: () => {
      toast.error("Erro ao criar categoria");
    },
  });

  const handleForm = (data: CreateCategoryFormValues) => {
    mutate(data)
  }

  return (
    <>
      <DialogClose ref={closeRef} className="hidden" />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          <BaseInput name="name" label="Nome" control={form.control} />
          <BaseButton
            type="submit"
            isLoading={isPending}
          >
            Criar categoria
          </BaseButton>
        </BaseForm>
      </Form>
    </>
  )
}
