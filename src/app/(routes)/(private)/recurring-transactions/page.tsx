'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { BaseDialog } from '@/components/portals/base-dialog';
import { Header } from '@/components/layout/header';
import { Fade } from '@/components/motions/fade';
import { StaggeredFade } from '@/components/motions/staggered-fade';
import { UpsertTransactionRecurringForm } from '@/forms/upsert-transaction-recurring.form';
import { RefreshCcw } from 'lucide-react';
import { RecurringTransactionTable } from './recurring-transaction.table';
import { useRecurringTransactionsAction } from './recurring-transaction.action';

const RecurringTransactionsPage = () => {
  const {
    data: recurringTransactions,
    isLoading,
    paginationParams,
    setPaginationParams,
  } = useRecurringTransactionsAction();

  return (
    <Fade>
      <Header
        title="Recorrentes"
        actions={[
          <BaseDialog
            key="new-recurring-dialog"
            title="Nova recorrente"
            description="Adicione uma nova transação recorrente"
            trigger={<BaseButton clickAction="create">Nova recorrente</BaseButton>}
          >
            <UpsertTransactionRecurringForm />
          </BaseDialog>,
        ]}
        fabActions={[
          {
            icon: RefreshCcw,
            label: 'Nova recorrente',
            dialogTitle: 'Nova recorrente',
            dialogDescription: 'Adicione uma nova transação recorrente',
            children: <UpsertTransactionRecurringForm />,
          },
        ]}
      />
      <StaggeredFade
        variant="page"
        className="grid grid-rows-[1fr]"
        itemClassNames={['overflow-y-hidden size-full']}
      >
        <RecurringTransactionTable
          isLoading={isLoading}
          recurringTransactions={recurringTransactions?.data ?? []}
          tableOptions={{
            pagination: {
              ...paginationParams,
              total: recurringTransactions?.pagination?.total ?? 0,
              totalPages: recurringTransactions?.pagination?.totalPages ?? 0,
            },
          }}
          onPaginationChange={setPaginationParams}
        />
      </StaggeredFade>
    </Fade>
  );
};

export default RecurringTransactionsPage;
