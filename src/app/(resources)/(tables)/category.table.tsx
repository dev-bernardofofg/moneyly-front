"use client"

import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog'
import { BaseTable } from '@/app/(components)/(bases)/(tables)/base-table'
import { BaseButton } from '@/app/(components)/(bases)/base-button'
import { queryClient } from '@/app/(contexts)'
import { categoryQueryData, DeleteCategoryRequest } from '@/app/(services)/category.service'
import { Category } from '@/app/(types)/category'
import { Pagination } from '@/app/(types)/pagination'
import { format } from 'date-fns'
import { PencilIcon } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmActionForm } from '../(forms)/confirm-action'
import { UpsertCategoryForm } from '../(forms)/upsert-category.form'

interface CategoryTableProps {
  categories: Category[]
  tableOptions: {
    page: Pagination
    totalCount: number
  }
  onPaginationChange?: (pagination: Pagination) => void
}

export const CategoryTable = ({ categories, tableOptions, onPaginationChange }: CategoryTableProps) => {
  const { mutate } = DeleteCategoryRequest({
    onSuccess: () => {
      toast.success('Categoria deletada com sucesso');
      queryClient.invalidateQueries({ queryKey: [categoryQueryData.getCategories] });
    },
    onError: () => {
      toast.error('Erro ao deletar categoria');
    },
  });

  const handleConfirm = (id: string) => {
    mutate(id);
  }

  return (
    <BaseTable
      title='Categorias'
      data={categories || []}
      emptyMessage='Nenhuma categoria encontrada'
      pagination={tableOptions.page}
      totalItems={tableOptions.totalCount}
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
          <ConfirmActionForm onConfirm={() => handleConfirm(item.id)} />
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
            return <span className='text-sm text-muted-foreground'>{format(item.createdAt, 'dd/MM/yyyy HH:mm')}
            </span>
          }
        },
        {
          header: "Atualizado em",
          accessorKey: "updatedAt",
          cell: (value, item) => {
            return <span className='text-sm text-muted-foreground'>{format(item.updatedAt, 'dd/MM/yyyy HH:mm')}</span>
          }
        }
      ]}
    />
  )
}
