'use client';

import { BaseForm } from '@/app/(components)/(bases)/(forms)/base-form';
import { BaseInput } from '@/app/(components)/(bases)/(forms)/base-input';
import { BaseSelect } from '@/app/(components)/(bases)/(forms)/base-select';
import { DialogFormFooter } from '@/app/(components)/(bases)/(forms)/dialog-form-footer';
import { useUpsertDialog } from '@/app/(hooks)/use-upsert-dialog';
import { Form } from '@/components/ui/form';
import {
  getGetAccountsQueryKey,
  usePostAccounts,
  usePutAccountsId,
} from '../(generated)/hooks/accounts/accounts';
import type { Account } from '../(generated)/types/Account';
import { getGetTransactionsQueryKey } from '../(generated)/hooks/transactions/transactions';
import { freeBalanceQueryKeys } from '../free-balance-query-keys';
import {
  AccountDefaultValues,
  AccountFormValues,
  AccountSchema,
} from '../(schemas)/account.schema';

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
          }
        : AccountDefaultValues,
      // Mudar fechamento/vencimento move compras de período: Saldo Livre e lista mudam.
      invalidateKeys: [
        getGetAccountsQueryKey(),
        getGetTransactionsQueryKey(),
        ...freeBalanceQueryKeys(),
      ],
      errorFields: ['name', 'closingDay', 'dueDay'],
      successMessage: {
        create: 'Conta criada com sucesso',
        update: 'Conta atualizada com sucesso',
      },
    });

  const createMutation = usePostAccounts({ mutation: { onSuccess: onCreated, onError } });
  const updateMutation = usePutAccountsId({ mutation: { onSuccess: onUpdated, onError } });

  const isCard = form.watch('type') === 'credit_card';

  const handleForm = ({ name, type, closingDay, dueDay }: AccountFormValues) => {
    if (isUpdate) {
      updateMutation.mutate({
        id: account.id,
        data: isCard ? { name, closingDay, dueDay } : { name },
      });
    } else if (type === 'credit_card') {
      createMutation.mutate({ data: { type, name, closingDay: closingDay!, dueDay: dueDay! } });
    } else {
      createMutation.mutate({ data: { type, name } });
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
              <p className="text-xs text-muted-foreground">
                Compras do cartão contam no Saldo Livre do período em que a fatura vence.
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
