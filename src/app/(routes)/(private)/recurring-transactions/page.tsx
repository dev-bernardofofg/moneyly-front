'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { Header } from '@/app/(components)/(layout)/header';
import { Fade } from '@/app/(components)/(motions)/fade';
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade';
import { UpsertTransactionRecurringForm } from '@/app/(resources)/(forms)/upsert-transaction-recurring.form';
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
      />
      <StaggeredFade
        variant="page"
        className="grid grid-rows-[1fr]"
        itemClassNames={['overflow-y-hidden size-full']}
      >
        <RecurringTransactionTable
          isLoading={isLoading}
          recurringTransactions={recurringTransactions?.data ?? []}
          tableOptions={{ pagination: paginationParams }}
          onPaginationChange={setPaginationParams}
        />
      </StaggeredFade>
    </Fade>
  );
};

export default RecurringTransactionsPage;
