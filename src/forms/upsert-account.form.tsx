'use client';

import { BaseForm } from '@/components/forms/base-form';
import { BaseDatePicker } from '@/components/forms/base-date-picker';
import { BaseInput } from '@/components/forms/base-input';
import { BaseSelect } from '@/components/forms/base-select';
import { DialogFormFooter } from '@/components/forms/dialog-form-footer';
import { useUpsertDialog } from '@/hooks/use-upsert-dialog';
import { Form } from '@/components/ui/form';
import {
  getGetAccountsQueryKey,
  usePostAccounts,
  usePutAccountsId,
} from '@/api/generated/hooks/accounts/accounts';
import type { Account } from '@/api/generated/types/Account';
import { getGetTransactionsQueryKey } from '@/api/generated/hooks/transactions/transactions';
import { freeBalanceQueryKeys } from '@/api/free-balance-query-keys';
import { FN_UTILS_DATE } from '@/lib/date';
import { FN_UTILS_STRING } from '@/lib/string';
import { AccountDefaultValues, AccountFormValues, AccountSchema } from '@/schemas/account.schema';

const DAYS = Array.from({ length: 31 }, (_, i) => ({ label: String(i + 1), value: i + 1 }));

interface UpsertAccountFormProps {
  account?: Account;
}

export const UpsertAccountForm = ({ account }: UpsertAccountFormProps) => {
  const isUpdate = !!account;

  const { form, onCreated, onUpdated, onError, DialogCloseHidden } =
    useUpsertDialog<AccountFormValues>({
      schema: AccountSchema,
      defaultValues: account
        ? {
            name: account.name,
            type: account.type,
            closingDay: account.closingDay ?? undefined,
            dueDay: account.dueDay ?? undefined,
            creditLimit: FN_UTILS_STRING.formatCentsToMoneyInput(account.creditLimit),
            openingBalance: account.openingBalanceDate
              ? FN_UTILS_STRING.formatCentsToMoneyInput(account.openingBalance)
              : '',
            openingBalanceDate: account.openingBalanceDate
              ? FN_UTILS_DATE.formatInBusinessTZ(account.openingBalanceDate, 'yyyy-MM-dd')
              : '',
          }
        : AccountDefaultValues,
      // Mudar fechamento/vencimento move compras de período: Saldo Livre e lista mudam.
      invalidateKeys: [
        getGetAccountsQueryKey(),
        getGetTransactionsQueryKey(),
        ...freeBalanceQueryKeys(),
      ],
      errorFields: [
        'name',
        'closingDay',
        'dueDay',
        'creditLimit',
        'openingBalance',
        'openingBalanceDate',
      ],
      successMessage: {
        create: 'Conta criada com sucesso',
        update: 'Conta atualizada com sucesso',
      },
    });

  const createMutation = usePostAccounts({ mutation: { onSuccess: onCreated, onError } });
  const updateMutation = usePutAccountsId({ mutation: { onSuccess: onUpdated, onError } });

  const isCard = form.watch('type') === 'credit_card';

  const handleForm = ({
    name,
    type,
    closingDay,
    dueDay,
    creditLimit,
    openingBalance,
    openingBalanceDate,
  }: AccountFormValues) => {
    // Campo vazio = sem limite.
    const limitCents = creditLimit ? FN_UTILS_STRING.formatMoneyInputToCents(creditLimit) : 0;
    const opening = openingBalanceDate
      ? {
          openingBalance: FN_UTILS_STRING.formatMoneyInputToCents(openingBalance || '0'),
          openingBalanceDate,
        }
      : undefined;

    if (isUpdate) {
      updateMutation.mutate({
        id: account.id,
        data: isCard
          ? { name, closingDay, dueDay, creditLimit: limitCents || null }
          : // Data apagada remove o saldo inicial; o back zera o valor.
            { name, ...(opening ?? (account.openingBalanceDate && { openingBalanceDate: null })) },
      });
    } else if (type === 'credit_card') {
      createMutation.mutate({
        data: {
          type,
          name,
          closingDay: closingDay!,
          dueDay: dueDay!,
          ...(limitCents > 0 && { creditLimit: limitCents }),
        },
      });
    } else {
      createMutation.mutate({ data: { type, name, ...opening } });
    }
  };

  return (
    <>
      <DialogCloseHidden />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleForm)}>
          {!isUpdate && (
            <BaseSelect
              control={form.control}
              name="type"
              label="Tipo"
              options={[
                { label: 'Cartão de crédito', value: 'credit_card' },
                { label: 'Conta corrente', value: 'checking' },
              ]}
            />
          )}
          <BaseInput
            name="name"
            label="Nome"
            control={form.control}
            placeholder={isCard ? 'Ex: Cartão Inter' : 'Ex: Conta Nubank'}
            autoFocus
          />
          {isCard && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <BaseSelect
                  control={form.control}
                  name="closingDay"
                  label="Fechamento"
                  options={DAYS}
                />
                <BaseSelect
                  control={form.control}
                  name="dueDay"
                  label="Vencimento"
                  options={DAYS}
                />
              </div>
              <BaseInput
                name="creditLimit"
                label="Limite (opcional)"
                type="money"
                placeholder="0,00"
                control={form.control}
              />
              <p className="text-xs text-muted-foreground">
                Compras do cartão contam no Saldo Livre do período em que a fatura vence.
              </p>
            </>
          )}
          {!isCard && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <BaseInput
                  name="openingBalance"
                  label="Saldo inicial"
                  type="money"
                  placeholder="0,00"
                  control={form.control}
                />
                <BaseDatePicker
                  name="openingBalanceDate"
                  label="Data do saldo"
                  control={form.control}
                  disableFutureDates
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Saldo no início desse dia. Lançamentos anteriores já estão nele e não contam de novo
                no Saldo Livre.
              </p>
            </>
          )}
          <DialogFormFooter
            submitLabel={isUpdate ? 'Atualizar' : 'Criar'}
            isLoading={isUpdate ? updateMutation.isPending : createMutation.isPending}
          />
        </BaseForm>
      </Form>
    </>
  );
};
