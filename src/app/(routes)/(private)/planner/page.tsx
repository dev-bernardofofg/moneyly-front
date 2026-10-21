'use client';

import { Section } from '@/components/cards/section';
import { BaseButton } from '@/components/clickable/base-button';
import { PeriodNavigatorWrapper } from '@/components/layout/period-navigator-wrapper';
import { BaseDialog } from '@/components/portals/base-dialog';
import { PlannerStats } from '@/components/stats/planner-stats';
import { BudgetSwiper } from '@/components/swipers/budget-swiper';
import { GoalSwiper } from '@/components/swipers/goal-swiper';
import { Header } from '@/components/layout/header';
import { Fade } from '@/components/motions/fade';
import { StaggeredFade } from '@/components/motions/staggered-fade';
import { UpsertBudgetForm } from '@/forms/upsert-budget.form';
import { UpsertGoalForm } from '@/forms/upsert-goal.form';
import { Target, Wallet } from 'lucide-react';
import { FreeBalanceImpactSection } from './free-balance-impact-section';
import { usePlannerAction } from './planner.action';

const PlannerPage = () => {
  const { data, loading } = usePlannerAction();

  return (
    <Fade>
      <Header
        title="Planejamento Financeiro"
        actions={[
          <BaseDialog
            key="new-budget-dialog"
            title="Novo Orçamento"
            description="Adicione um novo orçamento"
            trigger={<BaseButton clickAction="create">Novo Orçamento</BaseButton>}
          >
            <UpsertBudgetForm />
          </BaseDialog>,
          <BaseDialog
            key="new-goal-dialog"
            title="Novo Objetivo de Poupança"
            description="Adicione um novo objetivo de poupança"
            trigger={<BaseButton clickAction="create">Novo Objetivo</BaseButton>}
          >
            <UpsertGoalForm />
          </BaseDialog>,
        ]}
        fabActions={[
          {
            icon: Wallet,
            label: 'Novo orçamento',
            dialogTitle: 'Novo Orçamento',
            dialogDescription: 'Adicione um novo orçamento',
            children: <UpsertBudgetForm />,
          },
          {
            icon: Target,
            label: 'Novo objetivo',
            dialogTitle: 'Novo Objetivo de Poupança',
            dialogDescription: 'Adicione um novo objetivo de poupança',
            children: <UpsertGoalForm />,
          },
        ]}
      />
      <StaggeredFade
        variant="page"
        className="grid grid-rows-[auto_auto_auto_1fr_1fr] size-full"
        itemClassNames={['min-w-0', undefined, 'min-w-0', 'min-w-0', 'min-w-0']}
      >
        <PeriodNavigatorWrapper />
        <PlannerStats
          totalBudgeted={data.stats?.totalBudgeted}
          savingsGoal={data.stats?.totalSavingsGoal}
          alreadySaved={data.stats?.totalSaved}
          alerts={data.alerts}
          loading={loading.isLoadingOverview}
        />
        <FreeBalanceImpactSection
          impact={data.freeBalanceImpact}
          loading={loading.isLoadingOverview}
          error={loading.isOverviewError}
        />

        <Section
          Icon={Target}
          title="Orçamentos por Categoria"
          className="p-2 size-full"
          classNameHeader="p-3"
          classNameContent="grid grid-rows-[auto_1fr] grid-cols-1"
        >
          <BudgetSwiper budgets={data.budgets} loading={loading.isLoadingBudgets} />
        </Section>

        <Section
          Icon={Target}
          title="Objetivos de Poupança"
          className="p-2"
          classNameHeader="p-3"
          classNameContent="grid grid-rows-[auto_1fr] grid-cols-1"
        >
          <GoalSwiper goals={data.goals} loading={loading.isLoadingGoals} />
        </Section>
      </StaggeredFade>
    </Fade>
  );
};

export default PlannerPage;
