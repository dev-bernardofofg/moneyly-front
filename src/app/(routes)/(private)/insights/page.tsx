"use client";

import { BaseStats } from "@/app/(components)/(bases)/(stats)/base-stats";
import { Section } from "@/app/(components)/(bases)/(cards)/section";
import { Header } from "@/app/(components)/(layout)/header";
import { Fade } from "@/app/(components)/(motions)/fade";
import { StaggeredFade } from "@/app/(components)/(motions)/staggered-fade";
import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";
import { useGetOverviewInsights } from "@/app/(resources)/(generated)/hooks/overview/overview";
import {
  BarChart3,
  CalendarClock,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

const pct = (v: number | null | undefined) =>
  v == null ? "—" : `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;

const InsightsPage = () => {
  const { data, isLoading } = useGetOverviewInsights();
  const insights = data?.data;

  const cp = insights?.currentPeriod;
  const trend = insights?.trend;
  const allTime = insights?.allTime;
  const topCategories = insights?.topCategories ?? [];

  return (
    <Fade>
      <Header title="Insights" />
      <StaggeredFade variant="page" className="grid gap-2 overflow-y-auto p-1">
        <StaggeredFade className="grid grid-cols-1 gap-2 md:grid-cols-4">
          <BaseStats
            name="Gasto no período"
            value={cp?.currentExpense ?? 0}
            Icon={Wallet}
            isMonetary
            variant="destructive"
            loading={isLoading}
          />
          <BaseStats
            name="Projeção de gasto"
            value={cp?.projectedExpense ?? 0}
            Icon={TrendingUp}
            description={cp?.isOnTrack ? "No ritmo do orçamento" : "Acima do previsto"}
            isMonetary
            variant={cp?.isOnTrack ? "default" : "destructive"}
            loading={isLoading}
          />
          <BaseStats
            name="Período decorrido"
            value={`${cp?.daysElapsed ?? 0}/${cp?.totalDays ?? 0} dias`}
            Icon={CalendarClock}
            description={`${(cp?.completionPercentage ?? 0).toFixed(0)}% concluído`}
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

        <Section Icon={TrendingUp} title="Tendência mês a mês">
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <BaseStats
              name="Variação de despesa"
              value={pct(trend?.expenseChange)}
              Icon={TrendingDown}
              description={
                trend?.currentMonth?.label && trend?.previousMonth?.label
                  ? <span className="capitalize">{`${trend.previousMonth.label} → ${trend.currentMonth.label}`}</span>
                  : "Sem mês anterior para comparar"
              }
              variant={
                (trend?.expenseChange ?? 0) > 0 ? "destructive" : "default"
              }
              loading={isLoading}
            />
            <BaseStats
              name="Variação de receita"
              value={pct(trend?.incomeChange)}
              Icon={TrendingUp}
              description={
                trend?.currentMonth?.label
                  ? `Mês atual: ${trend.currentMonth.label}`
                  : undefined
              }
              variant={
                (trend?.incomeChange ?? 0) >= 0 ? "default" : "destructive"
              }
              loading={isLoading}
            />
          </div>
        </Section>

        <Section Icon={BarChart3} title="Histórico geral">
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
              value={allTime?.bestMonth?.label ?? "—"}
              Icon={TrendingUp}
              description={
                allTime?.bestMonth
                  ? FN_UTILS_NUMBERS.formatCurrency(
                      allTime.bestMonth.balance ?? 0
                    )
                  : undefined
              }
              variant="default"
              loading={isLoading}
            />
            <BaseStats
              name="Pior mês"
              value={allTime?.worstMonth?.label ?? "—"}
              Icon={TrendingDown}
              description={
                allTime?.worstMonth
                  ? FN_UTILS_NUMBERS.formatCurrency(
                      allTime.worstMonth.balance ?? 0
                    )
                  : undefined
              }
              variant="destructive"
              loading={isLoading}
            />
          </div>
        </Section>

        <Section Icon={Wallet} title="Top categorias">
          {topCategories.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              {isLoading ? "Carregando..." : "Sem dados de categorias."}
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {topCategories.map((cat) => (
                <li
                  key={cat.name}
                  className="flex items-center justify-between py-3"
                >
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {cat.percentage.toFixed(1)}%
                    </span>
                    <span className="font-semibold text-expense">
                      {FN_UTILS_NUMBERS.formatCurrency(cat.amount)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </StaggeredFade>
    </Fade>
  );
};

export default InsightsPage;
