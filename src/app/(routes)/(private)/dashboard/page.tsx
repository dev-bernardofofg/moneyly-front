'use client';

import { BaseCard } from '@/components/cards/base-card';
import { MonthlyHistoryChart } from '@/components/charts/monthly-history-chart';
import { BaseButton } from '@/components/clickable/base-button';
import { PeriodNavigatorWrapper } from '@/components/layout/period-navigator-wrapper';
import { TransactionItem } from '@/components/list/transaction-item';
import { BaseDialog } from '@/components/portals/base-dialog';
import { BaseStats } from '@/components/stats/base-stats';
import { Header } from '@/components/layout/header';
import { Fade } from '@/components/motions/fade';
import { StaggeredFade } from '@/components/motions/staggered-fade';
import { TransactionTabs } from '@/forms/transaction.tabs';
import { RecentTransactionItem } from '@/api/generated';
import { ROUTES } from '@/lib/routes';
import { Loader2, Plus, Receipt, RefreshCcw, Scale } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DASHBOARD_STATS_CONFIG, useDashboardAction } from './dashboard.action';
import { CardBillsSection } from './card-bills-section';
import { FreeBalanceSection } from './free-balance-section';

const DashboardPage = () => {
  const { push } = useRouter();
  const { data, loading } = useDashboardAction();
  const { forecast, subs, cmp, recentTransactions, chartSeries, stats, cardBills } = data;
  const { isPostingOverview, forecastLoading, forecastError, cardBillsLoading, cardBillsError } =
    loading;

  const alerts = [
    ...(subs && subs.count > 0
      ? [
          {
            key: 'subs',
            Icon: RefreshCcw,
            text: `${subs.count} ${subs.count === 1 ? 'possível assinatura' : 'possíveis assinaturas'}${subs.topTitle ? ` · maior: ${subs.topTitle}` : ''}`,
          },
        ]
      : []),
    ...(cmp && cmp.deltaPct != null && cmp.signal !== 'stable'
      ? [
          {
            key: 'cmp',
            Icon: Scale,
            text: `Gastos ${Math.abs(cmp.deltaPct).toFixed(0)}% ${cmp.deltaPct > 0 ? 'acima' : 'abaixo'} da média`,
          },
        ]
      : []),
  ];

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
        className="grid size-full min-h-0 grid-rows-[auto_auto_auto_1fr] gap-2 overflow-y-auto p-2"
        itemClassNames={['min-w-0', 'min-w-0', 'min-w-0', 'min-h-0']}
      >
        <PeriodNavigatorWrapper />
        <StaggeredFade
          className="grid gap-2 lg:grid-cols-2"
          itemClassNames={['min-w-0', 'min-w-0']}
        >
          <FreeBalanceSection forecast={forecast} loading={forecastLoading} error={forecastError} />
          <div className="grid content-start gap-2">
            <div className="grid grid-cols-2 gap-2">
              {DASHBOARD_STATS_CONFIG.map((stat) => (
                <BaseStats
                  key={stat.indicator}
                  name={stat.name}
                  value={stats?.[stat.indicator] ?? 0}
                  Icon={stat.icon}
                  description={stat.description}
                  isMonetary={stat.isMonetary}
                  variant={stat.variant}
                  loading={isPostingOverview}
                />
              ))}
            </div>
            {/* Assinaturas e comparativo viram alertas de uma linha, só quando há algo a dizer. */}
            {alerts.length > 0 && (
              <ul className="space-y-1" aria-label="Alertas">
                {alerts.map((alert) => (
                  <li key={alert.key}>
                    <button
                      type="button"
                      onClick={() => push(ROUTES.INSIGHTS)}
                      className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white/95 px-3 py-2 text-left text-sm hover:bg-muted dark:border-slate-700 dark:bg-slate-800"
                    >
                      <alert.Icon className="size-4 shrink-0 text-primary" aria-hidden />
                      <span className="min-w-0 flex-1 truncate">{alert.text}</span>
                      <span className="shrink-0 text-xs text-muted-foreground">Ver</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </StaggeredFade>
        <CardBillsSection data={cardBills} loading={cardBillsLoading} error={cardBillsError} />
        <StaggeredFade
          className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-1 gap-2 w-full md:h-full min-h-0"
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
            <StaggeredFade className="space-y-1">
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
            className="size-full min-h-80 md:min-h-0"
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
