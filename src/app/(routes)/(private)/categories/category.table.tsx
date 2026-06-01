'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { BaseTable, BaseTableOptions } from '@/app/(components)/(bases)/(tables)/base-table';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { ConfirmActionForm } from '@/app/(resources)/(forms)/confirm-action';
import { UpsertCategoryForm } from '@/app/(resources)/(forms)/upsert-category.form';
import { Category } from '@/app/(resources)/(generated)/hooks/moneylyAPI.schemas';
import { PencilIcon, Trash2 } from 'lucide-react';
import { useCategoryAction } from './category.action';

interface CategoryTableProps extends BaseTableOptions {
  categories: Category[];
  isLoading: boolean;
}

export const CategoryTable = ({
  categories,
  tableOptions,
  onPaginationChange,
  isLoading,
}: CategoryTableProps) => {
  const {
    categoryActions: { mutate, isPending },
  } = useCategoryAction();

  const handleConfirm = (id: string) => {
    mutate({ id });
  };

  return (
    <BaseTable
      title="Categorias"
      data={categories || []}
      loading={isLoading}
      emptyMessage="Nenhuma categoria encontrada"
      pagination={tableOptions.pagination}
      onPaginationChange={onPaginationChange}
      actions={(item) => (
        <div className="flex items-center gap-2">
          <BaseDialog
            title="Editar categoria"
            description="Editar categoria"
            trigger={
              <BaseButton>
                <PencilIcon className="size-4" />
              </BaseButton>
            }
          >
            <UpsertCategoryForm category={item} />
          </BaseDialog>
          <ConfirmActionForm
            isLoading={isPending}
            onConfirm={() => handleConfirm(item.id || '')}
            title="Remover categoria"
            description="Tem certeza que deseja remover esta categoria?"
            trigger={
              <BaseButton variant="destructive" className="w-fit">
                <Trash2 className="size-4" />
              </BaseButton>
            }
          />
        </div>
      )}
      columns={[
        {
          header: 'Nome',
          accessorKey: 'name',
        },
        {
          header: 'Criado em',
          accessorKey: 'createdAt',
          cell: (_, item) => {
            if (!item.createdAt) return null;
            return (
              <div className="flex flex-col text-sm font-medium text-muted-foreground">
                <span>{FN_UTILS_DATE.formatInBusinessTZ(item.createdAt, 'dd/MM/yyyy')}</span>
                <span>{FN_UTILS_DATE.formatInBusinessTZ(item.createdAt, 'HH:mm')}</span>
              </div>
            );
          },
        },
        {
          header: 'Atualizado em',
          accessorKey: 'updatedAt',
          cell: (_, item) => {
            if (!item.updatedAt) return null;
            return (
              <div className="flex flex-col text-sm font-medium text-muted-foreground">
                <span>{FN_UTILS_DATE.formatInBusinessTZ(item.updatedAt, 'dd/MM/yyyy')}</span>
                <span>{FN_UTILS_DATE.formatInBusinessTZ(item.updatedAt, 'HH:mm')}</span>
              </div>
            );
          },
        },
      ]}
    />
  );
};
