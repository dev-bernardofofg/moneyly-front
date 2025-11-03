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
import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";
import { UpsertTransactionForm } from "@/app/(resources)/(forms)/upsert-transaction.form";
import { Transaction } from "@/app/(resources)/(generated)";
import { useGetOverviewDashboard } from "@/app/(resources)/(generated)/hooks/overview/overview";
import { ROUTES } from "@/app/(utils)/routes";
import { LinearProgress } from "@/components/ui/linear-progress";
import { useRouter } from "next/navigation";
import { DASHBOARD_STATS_INTERATOR } from "./dashboard.utils";

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
              value={(overviewData?.data.data?.stats?.[stat.indicator] ?? 0) as number}
              Icon={stat.icon}
              description={stat.description}
              isMonetary={stat.isMonetary}
              variant={stat.variant as "default" | "destructive" | "secondary"}
              loading={isPostingOverview}
            />
          ))}

        </StaggeredFade>
        <StaggeredFade className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
            {(() => {
              const monthlyHistory = overviewData?.data?.data?.monthlyHistory;

              if (!monthlyHistory || monthlyHistory.length === 0) {
                return (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">Nenhuma transação encontrada</p>
                  </div>
                );
              }

              return (
                <StaggeredFade className="space-y-2">
                  {monthlyHistory.map((transaction: Transaction) => (
                    <TransactionItem
                      key={transaction.id}
                      value={transaction.amount ? parseFloat(transaction.amount) : 0}
                      type={(transaction.type as "income" | "expense") ?? "expense"}
                      category={transaction.category?.name ?? ""}
                      date={transaction.date ?? ""}
                    />
                  ))}
                </StaggeredFade>
              );
            })()}
          </BaseCard>
          <BaseCard
            title="Melhores categorias"
            description="Suas categorias mais gastas no mês"
          >
            <StaggeredFade className="space-y-2">
              {overviewData?.data.data?.expensesByCategory?.length === 0 || !overviewData?.data.data?.expensesByCategory ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada</p>
                </div>
              ) : (
                <StaggeredFade className="space-y-2">
                  {overviewData?.data.data?.expensesByCategory.map((category: Transaction) => (
                    <div key={category.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <p>{category.category?.name}</p>
                        <p>{FN_UTILS_NUMBERS.formatCurrencyToNumber(category.amount ? parseFloat(category.amount) : 0)}</p>
                      </div>
                      <LinearProgress value={category.amount ? parseFloat(category.amount) : 0} maxValue={overviewData?.data.data?.stats?.totalExpense ? parseFloat(overviewData?.data.data?.stats?.totalExpense as string) : 0} />
                    </div>
                  ))}
                </StaggeredFade>
              )}
            </StaggeredFade>
          </BaseCard>
        </StaggeredFade>
      </StaggeredFade>

    </Fade>
  )
};

export default DashboardPage;
