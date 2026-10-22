'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { BaseDialog } from '@/components/portals/base-dialog';
import { BaseStats } from '@/components/stats/base-stats';
import { PeriodNavigatorWrapper } from '@/components/layout/period-navigator-wrapper';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { Fade } from '@/components/motions/fade';
import { StaggeredFade } from '@/components/motions/staggered-fade';
import { UpsertTransactionForm } from '@/forms/upsert-transaction.form';
import { GetTransactionsQueryParamsTypeEnumKey } from '@/api/generated/types/GetTransactions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TransactionTable } from '@/app/(routes)/(private)/transactions/transaction.table';
import { TRANSACTION_STATS_INTERATOR, useTransactionsAction } from './transaction.action';
import { ExportCsvButton } from './export-csv-button';
import { ExportCsvForm } from './export-csv-form';
import { ImportStatementForm } from './import-statement.form';
import { AccountFilter } from './account-filter';
import { Download, FileUp, Plus } from 'lucide-react';

const TransactionsPage = () => {
  const {
    data: transactions,
    isLoading,
    paginationParams,
    setPaginationParams,
    typeFilter,
    setTypeFilter,
    accountFilter,
    setAccountFilter,
    allPeriods,
    setAllPeriods,
  } = useTransactionsAction();

  return (
    <Fade>
      <Header
        title="Transações"
        actions={[
          <Select
            key="type-filter"
            value={typeFilter ?? 'all'}
            onValueChange={(v) =>
              setTypeFilter(v === 'all' ? undefined : (v as GetTransactionsQueryParamsTypeEnumKey))
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Entradas</SelectItem>
              <SelectItem value="expense">Saídas</SelectItem>
            </SelectContent>
          </Select>,
          <AccountFilter key="account-filter" value={accountFilter} onChange={setAccountFilter} />,
          <ExportCsvButton key="export-csv" />,
          <BaseDialog
            key="import-statement-dialog"
            title="Importar extrato"
            description="Envie o OFX do seu banco, revise e confirme as transações."
            trigger={<BaseButton variant="outline">Importar extrato</BaseButton>}
          >
            <ImportStatementForm />
          </BaseDialog>,
          <BaseDialog
            key="new-transaction-dialog"
            title="Nova transação"
            description="Adicione uma nova transação"
            trigger={<BaseButton clickAction="create">Nova transação</BaseButton>}
          >
            <UpsertTransactionForm />
          </BaseDialog>,
        ]}
        mobileHeaderActions={[
          <AccountFilter
            key="account-filter-mobile"
            className="w-36"
            value={accountFilter}
            onChange={setAccountFilter}
          />,
          <Select
            key="type-filter-mobile"
            value={typeFilter ?? 'all'}
            onValueChange={(v) =>
              setTypeFilter(v === 'all' ? undefined : (v as GetTransactionsQueryParamsTypeEnumKey))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="income">Entradas</SelectItem>
              <SelectItem value="expense">Saídas</SelectItem>
            </SelectContent>
          </Select>,
        ]}
        fabActions={[
          {
            icon: Download,
            label: 'Exportar CSV',
            dialogTitle: 'Exportar transações',
            dialogDescription: 'Escolha o período e o tipo de transação para exportar.',
            children: <ExportCsvForm />,
          },
          {
            icon: FileUp,
            label: 'Importar extrato',
            dialogTitle: 'Importar extrato',
            dialogDescription: 'Envie o OFX do seu banco, revise e confirme as transações.',
            children: <ImportStatementForm />,
          },
          {
            icon: Plus,
            label: 'Nova transação',
            dialogTitle: 'Nova transação',
            dialogDescription: 'Adicione uma nova transação',
            children: <UpsertTransactionForm />,
          },
        ]}
      />
      <StaggeredFade
        variant="page"
        className="grid grid-rows-[auto_auto_1fr]"
        itemClassNames={['min-w-0', undefined, 'overflow-y-hidden size-full']}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div className={cn('min-w-0 flex-1', allPeriods && 'pointer-events-none opacity-50')}>
            <PeriodNavigatorWrapper />
          </div>
          <BaseButton
            type="button"
            variant={allPeriods ? 'default' : 'outline'}
            aria-pressed={allPeriods}
            onClick={() => setAllPeriods((current) => !current)}
          >
            Todos os períodos
          </BaseButton>
        </div>
        <StaggeredFade className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
          tableOptions={{
            pagination: {
              ...paginationParams,
              total: transactions?.pagination?.total ?? 0,
              totalPages: transactions?.pagination?.totalPages ?? 0,
            },
          }}
          onPaginationChange={setPaginationParams}
        />
      </StaggeredFade>
    </Fade>
  );
};

export default TransactionsPage;
