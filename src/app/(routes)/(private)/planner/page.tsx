"use client"

import { Section } from '@/app/(components)/(bases)/(cards)/section'
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog'
import { PlannerStats } from '@/app/(components)/(bases)/(stats)/planner-stats'
import { BudgetSwiper } from '@/app/(components)/(bases)/(swipers)/budget-swiper'
import { GoalSwiper } from '@/app/(components)/(bases)/(swipers)/goal-swiper'
import { BaseButton } from '@/app/(components)/(bases)/base-button'
import { PeriodNavigatorWrapper } from '@/app/(components)/(bases)/period-navigator-wrapper'
import { Header } from '@/app/(components)/(layout)/header'
import { Fade } from '@/app/(components)/(motions)/fade'
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade'
import { usePeriod } from '@/app/(contexts)/period-provider'
import { UpsertBudgetForm } from '@/app/(resources)/(forms)/upsert-budget.form'
import { UpsertGoalForm } from '@/app/(resources)/(forms)/upsert-goal.form'
import { GetBudgets } from '@/app/(services)/budget.service'
import { GetGoals } from '@/app/(services)/goal.service'
import { GetOverviewPlannerRequest } from '@/app/(services)/overview.service'
import { Target } from 'lucide-react'

const PlannerPage = () => {
  const { selectedPeriodId } = usePeriod()
  const { data: budgets } = GetBudgets({ periodId: selectedPeriodId || undefined })
  const { data: goals } = GetGoals()
  const { data: overviewPlanner } = GetOverviewPlannerRequest()

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
      </BaseDialog>, <BaseDialog
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
      <StaggeredFade variant='page'>
        <PeriodNavigatorWrapper />

        <PlannerStats
          totalBudgeted={overviewPlanner?.data.stats.totalBudgeted}
          savingsGoal={overviewPlanner?.data.stats.totalSavingsGoal}
          alreadySaved={overviewPlanner?.data.stats.totalSaved}
          alerts={overviewPlanner?.data.alerts || []}
        />

        <Section
          Icon={Target}
          title="Orçamentos por Categoria"
        >
          <BudgetSwiper budgets={budgets?.data || []} />
        </Section>

        <Section
          Icon={Target}
          title="Objetivos de Poupança"
        >
          <GoalSwiper goals={goals?.data || []} />
        </Section>
      </StaggeredFade>
    </Fade>
  )
}

export default PlannerPage