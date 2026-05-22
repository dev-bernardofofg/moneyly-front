'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { Header } from '@/app/(components)/(layout)/header';
import { Fade } from '@/app/(components)/(motions)/fade';
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade';
import { UpsertCategoryForm } from '@/app/(resources)/(forms)/upsert-category.form';
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
      />
      <StaggeredFade variant="page" className="grid grid-rows-[auto]">
        <CategoryTable
          categories={data?.data || []}
          tableOptions={{
            pagination: paginationParams,
          }}
          onPaginationChange={setPaginationParams}
          isLoading={isLoading}
        />
      </StaggeredFade>
    </Fade>
  );
};

export default CategoriesPage;
