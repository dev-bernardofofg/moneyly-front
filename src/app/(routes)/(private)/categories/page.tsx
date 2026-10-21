'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { BaseDialog } from '@/components/portals/base-dialog';
import { Header } from '@/components/layout/header';
import { Fade } from '@/components/motions/fade';
import { StaggeredFade } from '@/components/motions/staggered-fade';
import { UpsertCategoryForm } from '@/forms/upsert-category.form';
import { Tag } from 'lucide-react';
import { CategoryTable } from './category.table';
import { useCategoryAction } from './category.action';

const CategoriesPage = () => {
  const { data, isLoading, paginationParams, setPaginationParams } = useCategoryAction();

  return (
    <Fade>
      <Header
        title="Categorias"
        actions={[
          <BaseDialog
            key="new-category-dialog"
            title="Nova categoria"
            description="Adicione uma nova categoria"
            trigger={<BaseButton>Nova categoria</BaseButton>}
          >
            <UpsertCategoryForm />
          </BaseDialog>,
        ]}
        fabActions={[
          {
            icon: Tag,
            label: 'Nova categoria',
            dialogTitle: 'Nova categoria',
            dialogDescription: 'Adicione uma nova categoria',
            children: <UpsertCategoryForm />,
          },
        ]}
      />
      <StaggeredFade variant="page" className="grid grid-rows-[auto]">
        <CategoryTable
          categories={data?.data || []}
          tableOptions={{
            pagination: {
              ...paginationParams,
              total: data?.pagination?.total ?? 0,
              totalPages: data?.pagination?.totalPages ?? 0,
            },
          }}
          onPaginationChange={setPaginationParams}
          isLoading={isLoading}
        />
      </StaggeredFade>
    </Fade>
  );
};

export default CategoriesPage;
