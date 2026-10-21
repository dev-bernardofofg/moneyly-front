'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { BaseDialog } from '@/components/portals/base-dialog';
import { PeriodNavigatorWrapper } from '@/components/layout/period-navigator-wrapper';
import { Header } from '@/components/layout/header';
import { Fade } from '@/components/motions/fade';
import { FN_UTILS_DATE } from '@/lib/date';
import { getErrorMessage } from '@/lib/errors';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { ConfirmActionForm } from '@/forms/confirm-action';
import { UpsertAccountForm } from '@/forms/upsert-account.form';
import {
  getGetAccountsQueryKey,
  useDeleteAccountsId,
  useGetAccounts,
} from '@/api/generated/hooks/accounts/accounts';
import type { CustomAxiosError } from '@/types/error.type';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useQueryClient } from '@tanstack/react-query';
import { CreditCard, Landmark, PencilIcon, Trash2, WalletCards } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AccountPeriodSummary } from './account-period-summary';
import { TransfersSection } from './transfers-section';
import { toast } from 'sonner';

const AccountsPage = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetAccounts();
  const accounts = data?.data ?? [];

  const remove = useDeleteAccountsId({
    mutation: {
      onSuccess: () => {
        toast.success('Conta removida');
        queryClient.invalidateQueries({ queryKey: getGetAccountsQueryKey() });
      },
      onError: (error: unknown) => toast.error(getErrorMessage(error as CustomAxiosError)),
    },
  });

  return (
    <Fade>
      <Header
        title="Contas e cartões"
        actions={[
          <BaseDialog
            key="new-account-dialog"
            title="Nova conta ou cartão"
            description="Cadastre de onde o dinheiro sai"
            trigger={<BaseButton clickAction="create">Nova conta</BaseButton>}
          >
            <UpsertAccountForm />
          </BaseDialog>,
        ]}
        fabActions={[
          {
            icon: WalletCards,
            label: 'Nova conta',
            dialogTitle: 'Nova conta ou cartão',
            dialogDescription: 'Cadastre de onde o dinheiro sai',
            children: <UpsertAccountForm />,
          },
        ]}
      />
      {/* content-start: o Fade dá 1fr de altura; sem isso as linhas do grid esticam e os cards ficam gigantes. */}
      <div className="grid content-start gap-2 overflow-y-auto p-2 sm:grid-cols-2 xl:grid-cols-3">
        <div className="sm:col-span-2 xl:col-span-3">
          <PeriodNavigatorWrapper />
        </div>
        {isLoading &&
          Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-28 w-full" />)}
        {accounts.map((account) => {
          const isCard = account.type === 'credit_card';
          const Icon = isCard ? CreditCard : Landmark;
          return (
            <article
              key={account.id}
              className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white/95 p-4 dark:border-slate-700 dark:bg-slate-800"
            >
              <div className="flex items-start gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0 space-y-1">
                  <h2 className="flex flex-wrap items-center gap-2 font-semibold">
                    <span className="truncate">{account.name}</span>
                    {account.isDefault && <Badge variant="outline">Padrão</Badge>}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {isCard
                      ? `Cartão · fecha dia ${account.closingDay} · vence dia ${account.dueDay}`
                      : 'Conta corrente'}
                  </p>
                  {!isCard &&
                    (account.currentBalance != null ? (
                      <p className="text-sm">
                        Saldo atual{' '}
                        <span
                          className={cn(
                            'font-semibold tabular-nums',
                            account.currentBalance < 0 ? 'text-expense' : 'text-income'
                          )}
                        >
                          {FN_UTILS_NUMBERS.formatCurrency(account.currentBalance)}
                        </span>
                        {account.openingBalanceDate && (
                          <span className="text-xs text-muted-foreground">
                            {' · desde '}
                            {FN_UTILS_DATE.formatInBusinessTZ(account.openingBalanceDate, 'dd/MM')}
                          </span>
                        )}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Informe o saldo inicial para ver o saldo atual.
                      </p>
                    ))}
                </div>
              </div>
              <AccountPeriodSummary accountId={account.id} isCard={isCard} />
              <div className="flex justify-end gap-2">
                <BaseDialog
                  title="Editar conta"
                  description={account.name}
                  trigger={
                    <BaseButton variant="outline" aria-label={`Editar ${account.name}`}>
                      <PencilIcon className="size-4" />
                    </BaseButton>
                  }
                >
                  <UpsertAccountForm account={account} />
                </BaseDialog>
                {!account.isDefault && (
                  <ConfirmActionForm
                    isLoading={remove.isPending}
                    onConfirm={() => remove.mutate({ id: account.id })}
                    title="Remover conta"
                    description="As transações já lançadas continuam no histórico."
                    trigger={
                      <BaseButton variant="destructive" aria-label={`Remover ${account.name}`}>
                        <Trash2 className="size-4" />
                      </BaseButton>
                    }
                  />
                )}
              </div>
            </article>
          );
        })}
        <div className="sm:col-span-2 xl:col-span-3">
          <TransfersSection />
        </div>
      </div>
    </Fade>
  );
};

export default AccountsPage;
