"use client"

import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog'
import { BaseButton } from '@/app/(components)/(bases)/base-button'
import { Header } from '@/app/(components)/(layout)/header'
import { Fade } from '@/app/(components)/(motions)/fade'
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade'
import { UpsertCategoryForm } from '@/app/(resources)/(forms)/upsert-category.form'
import { CategoryTable } from '@/app/(resources)/(tables)/category.table'
import { GetCategoriesRequest } from '@/app/(services)/category.service'

const CategoriesPage = () => {
  const { data, isLoading } = GetCategoriesRequest()

  return (
    <Fade>
      <Header
        title="Categorias"
        actions={
          <BaseDialog
            title="Nova categoria"
            description="Adicione uma nova categoria"
            trigger={<BaseButton>
              Nova categoria
            </BaseButton>}
          >
            <UpsertCategoryForm />
          </BaseDialog>
        }
      />
      <StaggeredFade className='p-2 bg-white/95 dark:bg-slate-900/50'>
        <CategoryTable categories={data || []} />
      </StaggeredFade>
    </Fade>
  )
}

export default CategoriesPage