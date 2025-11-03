"use client"

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button'
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog'
import { BaseTable, BaseTableOptions } from '@/app/(components)/(bases)/(tables)/base-table'
import { queryClient } from '@/app/(contexts)'
import { getErrorMessage } from '@/app/(helpers)/errors'
import { ConfirmActionForm } from '@/app/(resources)/(forms)/confirm-action'
import { UpsertCategoryForm } from '@/app/(resources)/(forms)/upsert-category.form'
import { deleteCategoriesDeleteId, useDeleteCategoriesDeleteId } from '@/app/(resources)/(generated)/hooks/categories/categories'
import { Category } from '@/app/(resources)/(generated)/hooks/moneylyAPI.schemas'
import { CustomAxiosError } from '@/app/(types)/error.type'
import { format } from 'date-fns'
import { PencilIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface CategoryTableProps extends BaseTableOptions {
  categories: Category[]
  isLoading: boolean
}

export const CategoryTable = ({ categories, tableOptions, onPaginationChange, isLoading }: CategoryTableProps) => {
  const { mutate } = useDeleteCategoriesDeleteId({
    mutation: {
      onSuccess: () => {
        toast.success('Categoria deletada com sucesso');
        queryClient.invalidateQueries({ queryKey: [deleteCategoriesDeleteId] });
      },
      onError: (error: CustomAxiosError) => {
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      },
    },
  });

  const handleConfirm = (id: string) => {
    mutate({ id });
  }

  return (
    <BaseTable
      title='Categorias'
      data={categories || []}
      loading={isLoading}
      emptyMessage='Nenhuma categoria encontrada'
      pagination={tableOptions.pagination}
      onPaginationChange={onPaginationChange}
      actions={(item) => (
        <div className="flex items-center gap-2">
          <BaseDialog
            title='Editar categoria'
            description='Editar categoria'
            trigger={<BaseButton>
              <PencilIcon className="size-4" />
            </BaseButton>}
          >
            <UpsertCategoryForm category={item} />
          </BaseDialog>
          <ConfirmActionForm onConfirm={() => handleConfirm(item.id || '')} title="Remover categoria" description="Tem certeza que deseja remover esta categoria?" trigger={
            <BaseButton variant="destructive" className="w-fit">
              <Trash2 className="size-4" />
            </BaseButton>
          } />
        </div>
      )}
      columns={[
        {
          header: "Nome",
          accessorKey: "name",
        },
        {
          header: "Criado em",
          accessorKey: "createdAt",
          cell: (value, item) => {
            return <span className='text-sm text-muted-foreground'>{format(item.createdAt || '', 'dd/MM/yyyy HH:mm')}
            </span>
          }
        },
        {
          header: "Atualizado em",
          accessorKey: "updatedAt",
          cell: (value, item) => {
            return <span className='text-sm text-muted-foreground'>{format(item.updatedAt || '', 'dd/MM/yyyy HH:mm')}</span>
          }
        }
      ]}
    />
  )
}
