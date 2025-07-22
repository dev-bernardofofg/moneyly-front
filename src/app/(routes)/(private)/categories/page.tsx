"use client"

import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog'
import { BaseButton } from '@/app/(components)/(bases)/base-button'
import { Header } from '@/app/(components)/(layout)/header'
import { Fade } from '@/app/(components)/(motions)/fade'
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade'
import { UpsertCategoryForm } from '@/app/(resources)/(forms)/upsert-category.form'
import { CategoryTable } from '@/app/(resources)/(tables)/category.table'
import { GetCategoriesRequest } from '@/app/(services)/category.service'
import { usePagination } from '@/hooks/use-pagination'

const CategoriesPage = () => {
  const { pagination, handlePaginationChange } = usePagination()

  const { data } = GetCategoriesRequest(pagination)

  return (
    <Fade>
      <Header
        title="Categorias"
        actions={
          [<BaseDialog
            title="Nova categoria"
            description="Adicione uma nova categoria"
            trigger={<BaseButton>
              Nova categoria
            </BaseButton>}
          >
            <UpsertCategoryForm />
          </BaseDialog>
          ]
        }
      />
      <StaggeredFade variant="page">
        <CategoryTable
          categories={data?.data.categories || []}
          tableOptions={{
            page: pagination,
            totalCount: data?.data.totalCount || 0
          }}
          onPaginationChange={handlePaginationChange}
        />
      </StaggeredFade>
    </Fade>
  )
}

export default CategoriesPage