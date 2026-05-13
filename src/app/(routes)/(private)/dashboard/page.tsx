"use client";

import { BaseCard } from "@/app/(components)/(bases)/(cards)/base-card";
import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { PeriodNavigatorWrapper } from "@/app/(components)/(bases)/(layout)/period-navigator-wrapper";
import { TransactionItem } from "@/app/(components)/(bases)/(list)/transaction-item";
import { BaseDialog } from "@/app/(components)/(bases)/(portals)/base-dialog";
import { BaseStats } from "@/app/(components)/(bases)/(stats)/base-stats";
import { Header } from "@/app/(components)/(layout)/header";
import { Fade } from "@/app/(components)/(motions)/fade";
import { StaggeredFade } from "@/app/(components)/(motions)/staggered-fade";
import { usePeriod } from "@/app/(contexts)/period-provider";
import { UpsertTransactionForm } from "@/app/(resources)/(forms)/upsert-transaction.form";
import { useGetOverviewDashboard } from "@/app/(resources)/(generated)/hooks/overview/overview";
import { DashboardStats } from "@/app/(resources)/(generated)/types/DashboardStats";
import { MonthlyHistoryChart } from "@/app/(components)/(bases)/(charts)/monthly-history-chart";
import { ROUTES } from "@/app/(utils)/routes";
import { useRouter } from "next/navigation";
import { DASHBOARD_STATS_INTERATOR } from "./dashboard.utils";
import { RecentTransactionItem } from "@/app/(resources)/(generated)";

const DashboardPage = () => {
  const { selectedPeriodId } = usePeriod();
  const { data: overviewData, isPending: isPostingOverview } = useGetOverviewDashboard({
    periodId: selectedPeriodId || undefined,
  });

  const { push } = useRouter();

  return (
    <Fade>
      <Header
        title="Dashboard"
        actions={
          [<BaseDialog
            key="new-transaction-dialog"
            title="Nova transação"
            description="Adicione uma nova transação"
            trigger={<BaseButton clickAction="create" className="flex items-center justify-start">
              Nova transação
            </BaseButton>}
          >
            <UpsertTransactionForm />
          </BaseDialog>
          ]
        }
      />

      <StaggeredFade variant="page">
        <PeriodNavigatorWrapper />
        <StaggeredFade className="grid base:grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          {DASHBOARD_STATS_INTERATOR.map((stat) => (
            <BaseStats
              key={stat.indicator}
              name={stat.name}
              value={((overviewData?.data?.stats as DashboardStats | undefined)?.[stat.indicator as keyof DashboardStats] ?? 0) as number}
              Icon={stat.icon}
              description={stat.description}
              isMonetary={stat.isMonetary}
              variant={stat.variant as "default" | "destructive" | "secondary"}
              loading={isPostingOverview}
            />
          ))}

        </StaggeredFade>
        <StaggeredFade
          className="grid grid-cols-1 md:grid-cols-3 gap-2"
          itemClassNames={[undefined, "md:col-span-2"]}
        >
          <BaseCard
            title="Transações Recentes"
            description="Suas últimas movimentações financeiras"
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
              {overviewData?.data?.recentTransactions?.map((transaction: RecentTransactionItem) => (
                <TransactionItem key={transaction.id} {...transaction} />
              ))}
            </StaggeredFade>
          </BaseCard>
        <BaseCard title="Histórico Mensal" description="Receitas e despesas ao longo dos meses">
          <MonthlyHistoryChart
            data={overviewData?.data?.chart?.data ?? []}
            isLoading={isPostingOverview}
          />
        </BaseCard>
        </StaggeredFade>

      </StaggeredFade>

    </Fade>
  )
};

export default DashboardPage;
