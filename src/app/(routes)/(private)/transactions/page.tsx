"use client"

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button"
import { PeriodNavigatorWrapper } from "@/app/(components)/(bases)/(layout)/period-navigator-wrapper"
import { BaseDialog } from "@/app/(components)/(bases)/(portals)/base-dialog"
import { Header } from "@/app/(components)/(layout)/header"
import { Fade } from "@/app/(components)/(motions)/fade"
import { StaggeredFade } from "@/app/(components)/(motions)/staggered-fade"
import { UpsertTransactionForm } from "@/app/(resources)/(forms)/upsert-transaction.form"

import { BaseStats } from "@/app/(components)/(bases)/(stats)/base-stats"
import { useGetTransactions } from "@/app/(resources)/(generated)/hooks/transactions/transactions"
import { TransactionTable } from "@/app/(routes)/(private)/transactions/transaction.table"
import { usePagination } from "@/hooks/use-pagination"
import { useState } from "react"
import { TRANSACTION_STATS_INTERATOR } from "./transaction.utils"

const TransactionsPage = () => {
  const [currentPagination, setCurrentPagination] = useState({
    page: 1,
    limit: 10,
  });


  const { data: transactions, isLoading } = useGetTransactions({
    page: currentPagination.page,
    limit: currentPagination.limit,
  });


  const { pagination, handlePaginationChange } = usePagination({
    serverPagination: transactions?.data.pagination,
    onPaginationChange: setCurrentPagination
  })


  return (
    <Fade>
      <Header
        title="Transações"
        actions={[<BaseDialog
          key="new-transaction-dialog"
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
        <PeriodNavigatorWrapper />
        <StaggeredFade className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {TRANSACTION_STATS_INTERATOR.map((stat) => (
            <BaseStats
              key={stat.indicator}
              name={stat.name}
              value={(transactions?.data as any)?.[stat.indicator] ?? 0}
              Icon={stat.icon}
              description={stat.description}
              isMonetary={stat.isMonetary}
              variant={stat.variant as "default" | "destructive" | "secondary"}
              loading={isLoading}
            />
          ))}

        </StaggeredFade>
        <StaggeredFade>
          <TransactionTable
            transactions={transactions?.data.data ?? []}
            tableOptions={{
              pagination: pagination,
              size: "sm"
            }} onPaginationChange={handlePaginationChange} />
        </StaggeredFade>
      </StaggeredFade>
    </Fade>
  )
}

export default TransactionsPage;