"use client"

import { BaseDialog } from "@/app/(components)/(bases)/(portals)/base-dialog"
import { BaseStats } from "@/app/(components)/(bases)/(stats)/base-stats"
import { BaseButton } from "@/app/(components)/(bases)/base-button"
import { Header } from "@/app/(components)/(layout)/header"
import { Fade } from "@/app/(components)/(motions)/fade"
import { StaggeredFade } from "@/app/(components)/(motions)/staggered-fade"
import { UpsertTransactionForm } from "@/app/(resources)/(forms)/upsert-transaction.form"
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react"

import { TransactionTable } from "@/app/(resources)/(tables)/transaction.table"
import { GetTransactionsRequest } from "@/app/(services)/transaction.service"
import { usePagination } from "@/hooks/use-pagination"

const TransactionsPage = () => {
  const { pagination, handlePaginationChange } = usePagination()

  const { data: transactions, isLoading: loadingTransactions } = GetTransactionsRequest(pagination);

  return (
    <Fade>
      <Header
        title="Transações"
        actions={[<BaseDialog
          title="Nova transação"
          description="Adicione uma nova transação"
          trigger={<BaseButton clickAction="create">
            Nova transação
          </BaseButton>}
        >
          <UpsertTransactionForm />
        </BaseDialog>]
        }
      />
      <StaggeredFade variant="page">
        <StaggeredFade className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <BaseStats
            name="Saldo"
            value={(transactions?.data.monthlyIncome ?? 0) + (transactions?.data.totalIncome ?? 0) - (transactions?.data.totalExpense ?? 0)}
            Icon={DollarSign}
            description="Saldo Disponível"
            isMonetary={true}
            loading={loadingTransactions}
          />

          <BaseStats
            name="Entradas"
            value={transactions?.data.totalIncome ?? 0}
            Icon={TrendingUp}
            description="Entradas totais"
            isMonetary={true}
            loading={loadingTransactions}
          />

          <BaseStats
            name="Saídas"
            value={transactions?.data.totalExpense ?? 0}
            Icon={TrendingDown}
            description="Gastos totais"
            isMonetary={true}
            variant="destructive"
            loading={loadingTransactions}
          />
        </StaggeredFade>
        <StaggeredFade>
          <TransactionTable transactions={transactions?.data.transactions ?? []} tableOptions={{
            page: pagination,
            totalCount: transactions?.data.totalCount ?? 0
          }} onPaginationChange={handlePaginationChange} />
        </StaggeredFade>
      </StaggeredFade>
    </Fade>
  )
}

export default TransactionsPage;