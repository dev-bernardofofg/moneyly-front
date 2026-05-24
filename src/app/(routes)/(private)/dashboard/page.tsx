'use client';

import { BaseCard } from '@/app/(components)/(bases)/(cards)/base-card';
import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { PeriodNavigatorWrapper } from '@/app/(components)/(bases)/(layout)/period-navigator-wrapper';
import { TransactionItem } from '@/app/(components)/(bases)/(list)/transaction-item';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { BaseStats } from '@/app/(components)/(bases)/(stats)/base-stats';
import { Header } from '@/app/(components)/(layout)/header';
import { Fade } from '@/app/(components)/(motions)/fade';
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade';
import { usePeriod } from '@/app/(contexts)/period-provider';
import {
  useGetOverviewDashboard,
  useGetOverviewForecast,
} from '@/app/(resources)/(generated)/hooks/overview/overview';
import { DashboardStats } from '@/app/(resources)/(generated)/types/DashboardStats';
import { MonthlyHistoryChart } from '@/app/(components)/(bases)/(charts)/monthly-history-chart';
import { ROUTES } from '@/app/(utils)/routes';
import { useRouter } from 'next/navigation';
import { Loader2, PiggyBank, Plus, Receipt, RefreshCcw, Scale } from 'lucide-react';
import { DASHBOARD_STATS_INTERATOR, useDashboardAction } from './dashboard.action';
import { RecentTransactionItem } from '@/app/(resources)/(generated)';
import { TransactionTabs } from '@/app/(resources)/(forms)/transaction.tabs';

const DashboardPage = () => {
  const { push } = useRouter();
  const { data, loading } = useDashboardAction();
  const { forecast, subs, cmp, recentTransactions, chartSeries, stats } = data;
  const { isPostingOverview, forecastLoading } = loading;

  return (
    <Fade>
      <Header
        title="Dashboard"
        actions={[
          <BaseDialog
            key="new-transaction-dialog"
            title="Nova transação"
            description="Adicione uma nova transação"
            trigger={
              <BaseButton clickAction="create" className="flex items-center justify-start">
                Nova transação
              </BaseButton>
            }
          >
            <TransactionTabs />
          </BaseDialog>,
        ]}
        fabActions={[
          {
            icon: Plus,
            label: 'Nova transação',
            dialogTitle: 'Nova transação',
            dialogDescription: 'Adicione uma nova transação',
            children: <TransactionTabs />,
          },
        ]}
      />

      <StaggeredFade
        variant="default"
        className="grid grid-rows-[auto_auto_1fr] size-full min-h-0 overflow-y-auto p-2 gap-2"
        itemClassNames={['min-w-0', undefined, 'min-h-0']}
      >
        <PeriodNavigatorWrapper />
        <StaggeredFade className="grid base:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          {DASHBOARD_STATS_INTERATOR.map((stat) => (
            <BaseStats
              key={stat.indicator}
              name={stat.name}
              value={
                ((stats as DashboardStats | undefined)?.[stat.indicator as keyof DashboardStats] ??
                  0) as number
              }
              Icon={stat.icon}
              description={stat.description}
              isMonetary={stat.isMonetary}
              variant={stat.variant as 'default' | 'destructive' | 'secondary'}
              loading={isPostingOverview}
            />
          ))}

          <BaseStats
            name="Saldo projetado"
            value={forecast?.projectedEndBalance ?? 0}
            Icon={PiggyBank}
            description="Prévia · ver em Insights"
            isMonetary
            variant={(forecast?.projectedEndBalance ?? 0) >= 0 ? 'default' : 'destructive'}
            loading={forecastLoading}
            clickable
            onClick={() => push(ROUTES.INSIGHTS)}
          />

          <BaseStats
            name="Possíveis assinaturas"
            value={subs?.count ?? 0}
            Icon={RefreshCcw}
            description={subs?.topTitle ? `Maior: ${subs.topTitle}` : 'Prévia · ver em Insights'}
            variant="secondary"
            loading={isPostingOverview}
            clickable
            onClick={() => push(ROUTES.INSIGHTS)}
          />

          <BaseStats
            name="Despesa vs média"
            value={
              cmp?.deltaPct == null
                ? '—'
                : `${cmp.deltaPct > 0 ? '+' : ''}${cmp.deltaPct.toFixed(1)}%`
            }
            Icon={Scale}
            description={cmp?.topHighlight ?? 'Prévia · ver em Insights'}
            variant={
              cmp?.signal === 'up'
                ? 'destructive'
                : cmp?.signal === 'down'
                  ? 'default'
                  : 'secondary'
            }
            loading={isPostingOverview}
            clickable
            onClick={() => push(ROUTES.INSIGHTS)}
          />
        </StaggeredFade>
        <StaggeredFade
          className="grid grid-cols-1 md:grid-cols-3 grid-rows-[1fr] gap-2 size-full min-h-0"
          itemClassNames={['min-h-0', 'md:col-span-2 min-h-0']}
        >
          <BaseCard
            title="Transações Recentes"
            description="Suas últimas movimentações financeiras"
            className="size-full"
            footer={
              <BaseButton
                variant="outline"
                className="w-full"
                clickAction="default"
                onClick={() => push(ROUTES.TRANSACTIONS)}
              >
                Ver mais
              </BaseButton>
            }
          >
            <StaggeredFade className="space-y-2">
              {isPostingOverview ? (
                <div className="flex min-h-[140px] flex-col items-center justify-center py-6 text-center">
                  <Loader2
                    className="mb-2 size-10 animate-spin text-muted-foreground/50"
                    aria-hidden
                  />
                  <p className="text-sm text-muted-foreground">Carregando transações…</p>
                </div>
              ) : recentTransactions.length === 0 ? (
                <div className="flex min-h-[140px] flex-col items-center justify-center py-6 text-center">
                  <Receipt className="mb-2 size-12 text-muted-foreground/50" aria-hidden />
                  <p className="text-sm text-muted-foreground">Nenhuma transação neste período.</p>
                </div>
              ) : (
                recentTransactions.map((transaction: RecentTransactionItem) => (
                  <TransactionItem key={transaction.id} {...transaction} />
                ))
              )}
            </StaggeredFade>
          </BaseCard>
          <BaseCard
            title="Histórico Mensal"
            description="Receitas e despesas ao longo dos meses"
            className="size-full"
            contentClassName="size-full"
          >
            <MonthlyHistoryChart data={chartSeries} isLoading={isPostingOverview} />
          </BaseCard>
        </StaggeredFade>
      </StaggeredFade>
    </Fade>
  );
};

export default DashboardPage;
