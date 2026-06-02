'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { Section } from '@/app/(components)/(bases)/(cards)/section';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import {
  RecurringSeed,
  UpsertTransactionRecurringForm,
} from '@/app/(resources)/(forms)/upsert-transaction-recurring.form';
import { useGetTransactionsSubscriptions } from '@/app/(resources)/(generated)/hooks/transactions/transactions';
import type { SubscriptionCandidate } from '@/app/(resources)/(generated)/types/SubscriptionCandidate';
import { RefreshCcw, Repeat } from 'lucide-react';

const seedFromCandidate = (c: SubscriptionCandidate): RecurringSeed => {
  const dayOfMonth =
    c.cadence === 'monthly' && c.firstDate
      ? Number(FN_UTILS_DATE.formatInBusinessTZ(c.firstDate, 'd'))
      : undefined;
  return {
    type: 'expense',
    title: c.title,
    amount: c.averageAmount,
    categoryId: c.categoryId,
    frequency: c.cadence,
    dayOfMonth,
  };
};

const CADENCE_LABEL: Record<SubscriptionCandidate['cadence'], string> = {
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
};

export const SubscriptionsSection = () => {
  const { data, isLoading } = useGetTransactionsSubscriptions();
  const candidates = data?.data ?? [];

  return (
    <Section Icon={RefreshCcw} title="Possíveis assinaturas" className="p-2" classNameHeader="p-3">
      {isLoading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Carregando...</p>
      ) : candidates.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhum gasto recorrente não cadastrado detectado.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          {candidates.map((candidate) => (
            <li
              key={`${candidate.title}-${candidate.categoryId}-${candidate.firstDate}`}
              className="flex items-center justify-between gap-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                  {candidate.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {candidate.categoryName} · {CADENCE_LABEL[candidate.cadence]} ·{' '}
                  {candidate.occurrences}x · ~
                  {FN_UTILS_NUMBERS.formatCurrency(candidate.monthlyCost)}/mês
                </p>
              </div>
              <div className="flex items-center gap-3 whitespace-nowrap">
                <span className="text-sm font-semibold text-expense">
                  {FN_UTILS_NUMBERS.formatCurrency(candidate.averageAmount)}
                </span>
                <BaseDialog
                  title="Virar recorrente"
                  description={`Cadastrar "${candidate.title}" como transação recorrente`}
                  trigger={
                    <BaseButton variant="outline">
                      <Repeat className="mr-1 size-4" />
                      Virar recorrente
                    </BaseButton>
                  }
                >
                  <UpsertTransactionRecurringForm seed={seedFromCandidate(candidate)} />
                </BaseDialog>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
};
