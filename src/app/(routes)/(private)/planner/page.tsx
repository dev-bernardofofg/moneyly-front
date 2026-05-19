"use client"

import { Section } from '@/app/(components)/(bases)/(cards)/section'
import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button'
import { PeriodNavigatorWrapper } from '@/app/(components)/(bases)/(layout)/period-navigator-wrapper'
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog'
import { PlannerStats } from '@/app/(components)/(bases)/(stats)/planner-stats'
import { BudgetSwiper } from '@/app/(components)/(bases)/(swipers)/budget-swiper'
import { GoalSwiper } from '@/app/(components)/(bases)/(swipers)/goal-swiper'
import { Header } from '@/app/(components)/(layout)/header'
import { Fade } from '@/app/(components)/(motions)/fade'
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade'
import { UpsertBudgetForm } from '@/app/(resources)/(forms)/upsert-budget.form'
import { UpsertGoalForm } from '@/app/(resources)/(forms)/upsert-goal.form'
import { Target } from 'lucide-react'
import { usePlannerAction } from './planner.action'

const PlannerPage = () => {
  const { data, loading } = usePlannerAction()

  return (
    <Fade>
      <Header title='Planejamento Financeiro' actions={[<BaseDialog
        key="new-budget-dialog"
        title="Novo Orçamento"
        description="Adicione um novo orçamento"
        trigger={<BaseButton clickAction='create'>
          Novo Orçamento
        </BaseButton>}
      >
        <UpsertBudgetForm />
      </BaseDialog>,
      <BaseDialog
        key="new-goal-dialog"
        title="Novo Objetivo de Poupança"
        description="Adicione um novo objetivo de poupança"
        trigger={<BaseButton clickAction='create'>
          Novo Objetivo
        </BaseButton>}
      >
        <UpsertGoalForm />
      </BaseDialog>]


      } />
      <StaggeredFade variant='page' className="grid grid-rows-[auto_auto_1fr_1fr] size-full" itemClassNames={["min-w-0", undefined, undefined, undefined]}>
        <PeriodNavigatorWrapper />
        <PlannerStats
          totalBudgeted={data.stats?.totalBudgeted}
          savingsGoal={data.stats?.totalSavingsGoal}
          alreadySaved={data.stats?.totalSaved}
          alerts={data.alerts}
          loading={loading.isFetchingOverview}
        />

        <Section
          Icon={Target}
          title="Orçamentos por Categoria"
        >
          <BudgetSwiper budgets={data.budgets} loading={loading.isFetchingBudgets} />
        </Section>

        <Section
          Icon={Target}
          title="Objetivos de Poupança"
        >
          <GoalSwiper goals={data.goals} loading={loading.isFetchingGoals} />
        </Section>
      </StaggeredFade>
    </Fade>
  )
}

export default PlannerPage
