"use client"

import { BaseTable } from '@/app/(components)/(bases)/(tables)/base-table'
import { BaseButton } from '@/app/(components)/(bases)/base-button'
import { GetCategoriesRequest } from '@/app/(services)/category.service'
import { format } from 'date-fns'
import { PencilIcon, TrashIcon } from 'lucide-react'

export const CategoryTable = () => {
  const { data, isLoading } = GetCategoriesRequest()

  return (
    <BaseTable
      title='Categorias'
      data={data || []}
      emptyMessage='Nenhuma categoria encontrada'
      loading={isLoading}
      actions={(item) => (
        <div className="flex items-center gap-2">
          <BaseButton
            variant="ghost"
            size="sm"
            className='border-yellow-500 text-yellow-500'
            onClick={() => {
              console.log(item)
            }}
          >
            <PencilIcon className="size-4" />
          </BaseButton>
          <BaseButton
            variant="ghost"
            size="sm"
            className='border-destructive text-destructive'
            onClick={() => {
              console.log(item)
            }}
          >
            <TrashIcon className="size-4" />
          </BaseButton>
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
            return <span className='text-sm text-muted-foreground'>{format(item.createdAt, 'dd/MM/yyyy HH:mm')}</span>
          }
        },
      ]}
    />
  )
}
