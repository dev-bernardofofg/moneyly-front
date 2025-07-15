"use client";

import { BaseCard } from "@/app/(components)/(bases)/(cards)/base-card";
import { TransactionItem } from "@/app/(components)/(bases)/(list)/transaction-item";
import { BaseDialog } from "@/app/(components)/(bases)/(portals)/base-dialog";
import { BaseStats } from "@/app/(components)/(bases)/(stats)/base-stats";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { Header } from "@/app/(components)/(layout)/header";
import { Fade } from "@/app/(components)/(motions)/fade";
import { StaggeredFade } from "@/app/(components)/(motions)/staggered-fade";
import { useAuth } from "@/app/(contexts)/auth-provider";
import { UpsertTransactionForm } from "@/app/(resources)/(forms)/upsert-transaction.form";
import { GetOverviewRequest } from "@/app/(services)/overview.service";
import { Button } from "@/components/ui/button";
import { DollarSign, List, TrendingDown, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: overview } = GetOverviewRequest();

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

        {JSON.stringify(overview?.data.stats)}

        <StaggeredFade className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <BaseStats
            name="Entradas"
            value={overview?.data.stats.totalIncome ?? 0}
            Icon={TrendingUp}
            description="Entradas totais"
            isMonetary={true}
          />

          <BaseStats
            name="Saídas"
            value={overview?.data.stats.totalExpense ?? 0}
            Icon={TrendingDown}
            description="Gastos totais"
            isMonetary={true}
            variant="destructive"
          />

          <BaseStats
            name="Saldo"
            value={overview?.data.stats.remainingBudget ?? 0}
            Icon={DollarSign}
            description="Saldo Disponível"
            isMonetary={true}
          />

          <BaseStats
            name="Transações"
            value={overview?.data.transactionsCount ?? 0}
            Icon={List}
            description="Total de transações"
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
        </StaggeredFade>
      </StaggeredFade>
    </Fade>
  )
};

export default DashboardPage;
