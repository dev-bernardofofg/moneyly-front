'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { BaseStats } from '@/app/(components)/(bases)/(stats)/base-stats';
import { Header } from '@/app/(components)/(layout)/header';
import { Fade } from '@/app/(components)/(motions)/fade';
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade';
import { UpsertTransactionForm } from '@/app/(resources)/(forms)/upsert-transaction.form';
import { TransactionTable } from '@/app/(routes)/(private)/transactions/transaction.table';
import { TRANSACTION_STATS_INTERATOR, useTransactionsAction } from './transaction.action';
import { ExportCsvButton } from './export-csv-button';

const TransactionsPage = () => {
  const {
    data: transactions,
    isLoading,
    paginationParams,
    setPaginationParams,
  } = useTransactionsAction();

  return (
    <Fade>
      <Header
        title="Transações"
        actions={[
          <ExportCsvButton key="export-csv" />,
          <BaseDialog
            key="new-transaction-dialog"
            title="Nova transação"
            description="Adicione uma nova transação"
            trigger={<BaseButton clickAction="create">Nova transação</BaseButton>}
          >
            <UpsertTransactionForm />
          </BaseDialog>,
        ]}
      />
      <StaggeredFade
        variant="page"
        className="grid grid-rows-[auto_1fr]"
        itemClassNames={[undefined, 'overflow-y-hidden size-full']}
      >
        <StaggeredFade className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {TRANSACTION_STATS_INTERATOR.map((stat) => (
            <BaseStats
              key={stat.indicator}
              name={stat.name}
              value={transactions?.summary?.[stat.indicator] ?? 0}
              Icon={stat.icon}
              description={stat.description}
              isMonetary={stat.isMonetary}
              variant={stat.variant}
              loading={isLoading}
            />
          ))}
        </StaggeredFade>
        <TransactionTable
          isLoading={isLoading}
          transactions={transactions?.data ?? []}
          tableOptions={{ pagination: paginationParams }}
          onPaginationChange={setPaginationParams}
        />
      </StaggeredFade>
    </Fade>
  );
};

export default TransactionsPage;
