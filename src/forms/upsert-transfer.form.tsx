'use client';

import { BaseDatePicker } from '@/components/forms/base-date-picker';
import { BaseForm } from '@/components/forms/base-form';
import { BaseInput } from '@/components/forms/base-input';
import { BaseSelect } from '@/components/forms/base-select';
import { DialogFormFooter } from '@/components/forms/dialog-form-footer';
import { Form } from '@/components/ui/form';
import { useUpsertDialog } from '@/hooks/use-upsert-dialog';
import { accountLabel, useAccounts } from '@/hooks/use-accounts';
import { FN_UTILS_STRING } from '@/lib/string';
import { getGetAccountsQueryKey } from '@/api/generated/hooks/accounts/accounts';
import {
  getGetTransfersQueryKey,
  usePostTransfers,
} from '@/api/generated/hooks/transfers/transfers';
import { freeBalanceQueryKeys } from '@/api/free-balance-query-keys';
import {
  TransferDefaultValues,
  TransferFormValues,
  TransferSchema,
} from '@/schemas/transfer.schema';

export const UpsertTransferForm = () => {
  const { accounts, isLoading } = useAccounts();
  // Só entre contas correntes: pagar fatura é marcar a fatura como paga.
  const options = accounts
    .filter((account) => account.type === 'checking')
    .map((account) => ({ label: accountLabel(account), value: account.id }));

  const { form, onCreated, onError, DialogCloseHidden } = useUpsertDialog<TransferFormValues>({
    schema: TransferSchema,
    defaultValues: TransferDefaultValues,
    invalidateKeys: [
      getGetTransfersQueryKey(),
      getGetAccountsQueryKey(),
      ...freeBalanceQueryKeys(),
    ],
    errorFields: ['fromAccountId', 'toAccountId', 'amount', 'date', 'description'],
    successMessage: { create: 'Transferência registrada', update: 'Transferência registrada' },
  });

  const create = usePostTransfers({ mutation: { onSuccess: onCreated, onError } });

  const handleSubmit = (data: TransferFormValues) =>
    create.mutate({
      data: {
        fromAccountId: data.fromAccountId,
        toAccountId: data.toAccountId,
        amount: FN_UTILS_STRING.formatMoneyInputToCents(data.amount),
        date: data.date,
        description: data.description || undefined,
      },
    });

  return (
    <>
      <DialogCloseHidden />
      <Form {...form}>
        <BaseForm onSubmit={form.handleSubmit(handleSubmit)}>
          <BaseInput
            control={form.control}
            name="amount"
            label="Valor"
            type="money"
            placeholder="0,00"
            autoFocus
          />
          <div className="grid grid-cols-2 gap-3">
            <BaseSelect
              control={form.control}
              name="fromAccountId"
              label="De"
              isLoading={isLoading}
              options={options}
            />
            <BaseSelect
              control={form.control}
              name="toAccountId"
              label="Para"
              isLoading={isLoading}
              options={options}
            />
          </div>
          <BaseDatePicker control={form.control} name="date" label="Data" disableFutureDates />
          <BaseInput control={form.control} name="description" label="Descrição (opcional)" />
          <p className="text-xs text-muted-foreground">
            Move o saldo entre as contas. Não conta como receita nem despesa.
          </p>
          <DialogFormFooter submitLabel="Registrar" isLoading={create.isPending} />
        </BaseForm>
      </Form>
    </>
  );
};
