"use client";

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { BaseDialog } from "@/app/(components)/(bases)/(portals)/base-dialog";
import { Header } from "@/app/(components)/(layout)/header";
import { Fade } from "@/app/(components)/(motions)/fade";
import { StaggeredFade } from "@/app/(components)/(motions)/staggered-fade";
import { UpsertTransactionRecurringForm } from "@/app/(resources)/(forms)/upsert-transaction-recurring.form";
import { useGetRecurringTransactions } from "@/app/(resources)/(generated)/hooks/recurring-transactions/recurring-transactions";
import { usePagination } from "@/hooks/use-pagination";
import { parseAsInteger, useQueryStates } from "nuqs";
import { RecurringTransactionTable } from "./recurring-transaction.table";

const RecurringTransactionsPage = () => {
  const [paginationParams, setPaginationParams] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(10),
  });

  const { data: recurringTransactions, isLoading } = useGetRecurringTransactions({
    includeInactive: true,
    page: paginationParams.page,
    limit: paginationParams.limit,
  });

  const { pagination, handlePaginationChange } = usePagination({
    serverPagination: recurringTransactions?.pagination,
    onPaginationChange: setPaginationParams,
  });

  return (
    <Fade>
      <Header
        title="Recorrentes"
        actions={[
          <BaseDialog
            key="new-recurring-dialog"
            title="Nova recorrente"
            description="Adicione uma nova transação recorrente"
            trigger={
              <BaseButton clickAction="create">Nova recorrente</BaseButton>
            }
          >
            <UpsertTransactionRecurringForm />
          </BaseDialog>,
        ]}
      />
      <StaggeredFade
        variant="page"
        className="grid grid-rows-[1fr]"
        itemClassNames={["overflow-y-hidden size-full"]}
      >
        <RecurringTransactionTable
          isLoading={isLoading}
          recurringTransactions={recurringTransactions?.data ?? []}
          tableOptions={{ pagination }}
          onPaginationChange={handlePaginationChange}
        />
      </StaggeredFade>
    </Fade>
  );
};

export default RecurringTransactionsPage;
