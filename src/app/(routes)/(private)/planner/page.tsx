"use client"

import { PlannerSection } from '@/app/(components)/(bases)/(cards)/planner-section'
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog'
import { PlannerStats } from '@/app/(components)/(bases)/(stats)/planner-stats'
import { BudgetSwiper } from '@/app/(components)/(bases)/(swipers)/budget-swiper'
import { GoalSwiper } from '@/app/(components)/(bases)/(swipers)/goal-swiper'
import { BaseButton } from '@/app/(components)/(bases)/base-button'
import { Header } from '@/app/(components)/(layout)/header'
import { Fade } from '@/app/(components)/(motions)/fade'
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade'
import { UpsertBudgetForm } from '@/app/(resources)/(forms)/upsert-budget.form'
import { UpsertGoalForm } from '@/app/(resources)/(forms)/upsert-goal.form'
import { GetBudgets } from '@/app/(services)/budget.service'
import { GetGoals } from '@/app/(services)/goal.service'

const PlannerPage = () => {
  const { data: budgets } = GetBudgets()
  const { data: goals } = GetGoals()

  return (
    <Fade>
      <Header title='Planejamento Financeiro' actions={
        <div className='flex items-center gap-2'>
          <BaseDialog
            title="Novo Orçamento"
            description="Adicione um novo orçamento"
            trigger={<BaseButton clickAction='create'>
              Novo Orçamento
            </BaseButton>}
          >
            <UpsertBudgetForm />
          </BaseDialog>

          <BaseDialog
            title="Novo Objetivo de Poupança"
            description="Adicione um novo objetivo de poupança"
            trigger={<BaseButton clickAction='create'>
              Novo Objetivo
            </BaseButton>}
          >
            <UpsertGoalForm />
          </BaseDialog>
        </div>
      } />

      <StaggeredFade variant='page'>
        <PlannerStats
          totalBudgeted={0}
          savingsGoal={0}
          alreadySaved={0}
          alerts={[]}
        />

        <PlannerSection
          title="Orçamentos por Categoria"
        >
          <BudgetSwiper budgets={budgets?.data || []} />
        </PlannerSection>

        <PlannerSection
          title="Objetivos de Poupança"
        >
          <GoalSwiper goals={goals?.data || []} />
        </PlannerSection>

      </StaggeredFade>
    </Fade>
  )
}

export default PlannerPage