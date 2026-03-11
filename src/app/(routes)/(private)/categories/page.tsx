"use client"

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button'
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog'
import { Header } from '@/app/(components)/(layout)/header'
import { Fade } from '@/app/(components)/(motions)/fade'
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade'
import { UpsertCategoryForm } from '@/app/(resources)/(forms)/upsert-category.form'
import { useGetCategories } from '@/app/(resources)/(generated)/hooks/categories/categories'
import { usePagination } from '@/hooks/use-pagination'
import { useState } from 'react'
import { CategoryTable } from './category.table'

const CategoriesPage = () => {
  const [currentPagination, setCurrentPagination] = useState({
    page: 1,
    limit: 10,
  });

  const { data, isLoading } = useGetCategories({
    page: currentPagination.page,
    limit: currentPagination.limit,
  })


  const { pagination, handlePaginationChange } = usePagination({
    serverPagination: data?.pagination,
    onPaginationChange: setCurrentPagination
  })

  return (
    <Fade>
      <Header
        title="Categorias"
        actions={
          [<BaseDialog
            key="new-category-dialog"
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
          categories={data?.data || []}
          tableOptions={{
            pagination: pagination,
          }}
          onPaginationChange={handlePaginationChange}
          isLoading={isLoading}
        />
      </StaggeredFade>
    </Fade>
  )
}

export default CategoriesPage