"use client";

import { BaseCard } from "@/app/(components)/(bases)/(cards)/base-card";
import { TransactionItem } from "@/app/(components)/(bases)/(list)/transaction-item";
import { BaseDialog } from "@/app/(components)/(bases)/(portals)/base-dialog";
import { BaseStats } from "@/app/(components)/(bases)/(stats)/base-stats";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { Header } from "@/app/(components)/(layout)/header";
import { Fade } from "@/app/(components)/(motions)/fade";
import { StaggeredFade } from "@/app/(components)/(motions)/staggered-fade";
import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";
import { UpsertTransactionForm } from "@/app/(resources)/(forms)/upsert-transaction.form";
import { GetOverviewRequest } from "@/app/(services)/overview.service";
import { Button } from "@/components/ui/button";
import { LinearProgress } from "@/components/ui/linear-progress";
import { DollarSign, List, TrendingDown, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const { data: overview, isLoading: loadingOverview } = GetOverviewRequest();

  return (
    <Fade>
      <Header
        title="Dashboard"
        actions={
          <BaseDialog
            title="Nova transação"
            description="Adicione uma nova transação"
            trigger={<BaseButton clickAction="create">
              Nova transação
            </BaseButton>}
          >
            <UpsertTransactionForm />
          </BaseDialog>
        }
      />
      <StaggeredFade className="p-2 space-y-2">
        <StaggeredFade className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <BaseStats
            name="Saldo"
            value={overview?.data.stats.remainingBudget ?? 0}
            Icon={DollarSign}
            description="Saldo Disponível"
            isMonetary={true}
            loading={loadingOverview}
          />

          <BaseStats
            name="Entradas"
            value={overview?.data.stats.totalIncome ?? 0}
            Icon={TrendingUp}
            description="Entradas totais"
            isMonetary={true}
            loading={loadingOverview}
          />

          <BaseStats
            name="Saídas"
            value={overview?.data.stats.totalExpense ?? 0}
            Icon={TrendingDown}
            description="Gastos totais"
            isMonetary={true}
            variant="destructive"
            loading={loadingOverview}
          />

          <BaseStats
            name="Transações"
            value={overview?.data.transactionsCount ?? 0}
            Icon={List}
            description="Total de transações"
            loading={loadingOverview}
          />

        </StaggeredFade>
        <StaggeredFade className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <BaseCard
            title="Transações Recentes"
            description="Suas últimas movimentações financeiras"
            footer={
              <Button
                variant="outline"
                size="sm"
                className="w-full"
              >
                Ver mais
              </Button>
            }
          >
            {overview?.data.monthlyHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-muted-foreground">Nenhuma transação encontrada</p>
              </div>
            ) : (
              <StaggeredFade className="space-y-2">
                {overview?.data.monthlyHistory.map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    value={transaction.amount}
                    type={transaction.type}
                    category={transaction.category}
                    date={transaction.date}
                  />
                ))}
              </StaggeredFade>
            )}
          </BaseCard>
          <BaseCard
            title="Melhores categorias"
            description="Suas categorias mais gastas no mês"
          >
            <StaggeredFade className="space-y-2">
              {overview?.data.expensesByCategory.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Nenhuma categoria encontrada</p>
                </div>
              ) : (
                <StaggeredFade className="space-y-2">
                  {overview?.data.expensesByCategory.map((category) => (
                    <div key={category.id} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <p>{category.name}</p>
                        <p>{FN_UTILS_NUMBERS.formatCurrencyToNumber(category.amount)}</p>
                      </div>
                      <LinearProgress value={category.amount} maxValue={overview?.data.stats.totalExpense ?? 0} />
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
