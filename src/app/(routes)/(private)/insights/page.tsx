'use client';

import { BaseStats } from '@/app/(components)/(bases)/(stats)/base-stats';
import { Section } from '@/app/(components)/(bases)/(cards)/section';
import { Header } from '@/app/(components)/(layout)/header';
import { Fade } from '@/app/(components)/(motions)/fade';
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade';
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import {
  BarChart3,
  CalendarClock,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react';
import { ComparisonSection } from './comparison-section';
import { SubscriptionsSection } from './subscriptions-section';
import { useInsightsAction } from './insights.action';

const formatDelta = (v: number | null | undefined) =>
  v == null ? '—' : `${v > 0 ? '+' : ''}${v.toFixed(1)}%`;

const InsightsPage = () => {
  const { isLoading, forecast, forecastLoading, currentPeriod, trend, allTime, topCategories } =
    useInsightsAction();

  return (
    <Fade>
      <Header title="Insights" />
      <StaggeredFade variant="page" className="grid gap-2 overflow-y-auto p-1">
        <Section
          Icon={PiggyBank}
          title="Saldo projetado (fim do período)"
          className="p-2"
          classNameHeader="p-3"
        >
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            <BaseStats
              name="Saldo realizado"
              value={forecast?.realized.balance ?? 0}
              Icon={Wallet}
              isMonetary
              variant={(forecast?.realized.balance ?? 0) >= 0 ? 'default' : 'destructive'}
              loading={forecastLoading}
            />
            <BaseStats
              name="Entradas previstas"
              value={forecast?.projected.recurringIncome ?? 0}
              Icon={TrendingUp}
              isMonetary
              variant="default"
              loading={forecastLoading}
            />
            <BaseStats
              name="Saídas previstas"
              value={forecast?.projected.recurringExpense ?? 0}
              Icon={TrendingDown}
              isMonetary
              variant="destructive"
              loading={forecastLoading}
            />
            <BaseStats
              name="Saldo projetado"
              value={forecast?.projectedEndBalance ?? 0}
              Icon={PiggyBank}
              description={`${forecast?.projected.occurrences.length ?? 0} ocorrências previstas`}
              isMonetary
              variant={(forecast?.projectedEndBalance ?? 0) >= 0 ? 'default' : 'destructive'}
              loading={forecastLoading}
            />
          </div>
        </Section>

        <StaggeredFade className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <BaseStats
            name="Gasto no período"
            value={currentPeriod?.currentExpense ?? 0}
            Icon={Wallet}
            isMonetary
            variant="destructive"
            loading={isLoading}
          />
          <BaseStats
            name="Projeção de gasto"
            value={currentPeriod?.projectedExpense ?? 0}
            Icon={TrendingUp}
            description={currentPeriod?.isOnTrack ? 'No ritmo do orçamento' : 'Acima do previsto'}
            isMonetary
            variant={currentPeriod?.isOnTrack ? 'default' : 'destructive'}
            loading={isLoading}
          />
          <BaseStats
            name="Período decorrido"
            value={`${currentPeriod?.daysElapsed ?? 0}/${currentPeriod?.totalDays ?? 0} dias`}
            Icon={CalendarClock}
            description={`${(currentPeriod?.completionPercentage ?? 0).toFixed(0)}% concluído`}
            variant="secondary"
            loading={isLoading}
          />
          <BaseStats
            name="Transações (total)"
            value={allTime?.totalTransactions ?? 0}
            Icon={BarChart3}
            description={`${allTime?.totalMonths ?? 0} meses de histórico`}
            variant="secondary"
            loading={isLoading}
          />
        </StaggeredFade>

        <Section
          Icon={TrendingUp}
          title="Tendência mês a mês"
          className="p-2"
          classNameHeader="p-3"
        >
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <BaseStats
              name="Variação de despesa"
              value={formatDelta(trend?.expenseChange)}
              Icon={TrendingDown}
              description={
                trend?.currentMonth?.label && trend?.previousMonth?.label ? (
                  <span className="capitalize">{`${trend.previousMonth.label} → ${trend.currentMonth.label}`}</span>
                ) : (
                  'Sem mês anterior para comparar'
                )
              }
              variant={(trend?.expenseChange ?? 0) > 0 ? 'destructive' : 'default'}
              loading={isLoading}
            />
            <BaseStats
              name="Variação de receita"
              value={formatDelta(trend?.incomeChange)}
              Icon={TrendingUp}
              description={
                trend?.currentMonth?.label ? `Mês atual: ${trend.currentMonth.label}` : undefined
              }
              variant={(trend?.incomeChange ?? 0) >= 0 ? 'default' : 'destructive'}
              loading={isLoading}
            />
          </div>
        </Section>

        <Section Icon={BarChart3} title="Histórico geral" className="p-2" classNameHeader="p-3">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <BaseStats
              name="Despesa média mensal"
              value={allTime?.averageMonthlyExpense ?? 0}
              Icon={TrendingDown}
              isMonetary
              variant="destructive"
              loading={isLoading}
            />
            <BaseStats
              name="Receita média mensal"
              value={allTime?.averageMonthlyIncome ?? 0}
              Icon={TrendingUp}
              isMonetary
              variant="default"
              loading={isLoading}
            />
            <BaseStats
              name="Melhor mês"
              value={allTime?.bestMonth?.label ?? '—'}
              Icon={TrendingUp}
              description={
                allTime?.bestMonth
                  ? FN_UTILS_NUMBERS.formatCurrency(allTime.bestMonth.balance ?? 0)
                  : undefined
              }
              variant="default"
              loading={isLoading}
            />
            <BaseStats
              name="Pior mês"
              value={allTime?.worstMonth?.label ?? '—'}
              Icon={TrendingDown}
              description={
                allTime?.worstMonth
                  ? FN_UTILS_NUMBERS.formatCurrency(allTime.worstMonth.balance ?? 0)
                  : undefined
              }
              variant="destructive"
              loading={isLoading}
            />
          </div>
        </Section>

        <Section Icon={Wallet} title="Top categorias" className="p-2" classNameHeader="p-3">
          {topCategories.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {isLoading ? 'Carregando...' : 'Sem dados de categorias.'}
            </p>
          ) : (
            <ul className="space-y-1">
              {topCategories.map((category) => (
                <li
                  key={category.name}
                  className="flex items-center justify-between p-3 bg-white/95 dark:bg-slate-800 rounded-lg shadow-xs border border-slate-200 dark:border-slate-700"
                >
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {category.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {category.percentage.toFixed(1)}%
                    </span>
                    <span className="font-semibold text-expense">
                      {FN_UTILS_NUMBERS.formatCurrency(category.amount)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <ComparisonSection />
        <SubscriptionsSection />
      </StaggeredFade>
    </Fade>
  );
};

export default InsightsPage;
