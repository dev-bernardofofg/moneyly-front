'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { Section } from '@/app/(components)/(bases)/(cards)/section';
import { FN_UTILS_DATE } from '@/app/(helpers)/date';
import { getErrorMessage } from '@/app/(helpers)/errors';
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import {
  getGetRecurringTransactionsQueryKey,
  usePostRecurringTransactionsFromSubscription,
} from '@/app/(resources)/(generated)/hooks/recurring-transactions/recurring-transactions';
import {
  getGetTransactionsSubscriptionsQueryKey,
  useGetTransactionsSubscriptions,
} from '@/app/(resources)/(generated)/hooks/transactions/transactions';
import type { SubscriptionCandidate } from '@/app/(resources)/(generated)/types/SubscriptionCandidate';
import { CustomAxiosError } from '@/app/(types)/error.type';
import { useQueryClient } from '@tanstack/react-query';
import { RefreshCcw, Repeat } from 'lucide-react';
import { toast } from 'sonner';

const CADENCE_LABEL: Record<SubscriptionCandidate['cadence'], string> = {
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
};

const SubscriptionRow = ({ candidate }: { candidate: SubscriptionCandidate }) => {
  const queryClient = useQueryClient();

  const { mutate: convert, isPending } = usePostRecurringTransactionsFromSubscription({
    mutation: {
      onSuccess: (res) => {
        toast.success(
          `Recorrente criada. Próxima cobrança em ${FN_UTILS_DATE.formatInBusinessTZ(
            res.data.nextExecution,
            'dd/MM'
          )}.`
        );
        // Recorrentes muda; assinaturas pode continuar listando o candidato (heurística
        // olha transações antigas) — invalidar deixa a lista se reconciliar.
        queryClient.invalidateQueries({ queryKey: getGetRecurringTransactionsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetTransactionsSubscriptionsQueryKey() });
      },
      // 409 (recorrente ativa com mesmo título) e 400 (categoria inexistente) trazem a
      // mensagem em `error` — getErrorMessage já a extrai.
      onError: (error: CustomAxiosError) => {
        toast.error(getErrorMessage(error));
      },
    },
  });

  const handleConvert = () => {
    convert({
      data: {
        title: candidate.title,
        amount: candidate.averageAmount,
        categoryId: candidate.categoryId,
        cadence: candidate.cadence,
        nextEstimatedDate: candidate.nextEstimatedDate,
      },
    });
  };

  return (
    <li className="flex items-center justify-between gap-3 py-3">
      <div className="min-w-0">
        <p className="truncate font-medium text-slate-900 dark:text-slate-100">{candidate.title}</p>
        <p className="truncate text-xs text-muted-foreground">
          {candidate.categoryName} · {CADENCE_LABEL[candidate.cadence]} · {candidate.occurrences}x ·
          ~{FN_UTILS_NUMBERS.formatCurrency(candidate.monthlyCost)}/mês
        </p>
      </div>
      <div className="flex items-center gap-3 whitespace-nowrap">
        <span className="text-sm font-semibold text-expense">
          {FN_UTILS_NUMBERS.formatCurrency(candidate.averageAmount)}
        </span>
        <BaseButton
          variant="outline"
          onClick={handleConvert}
          isLoading={isPending}
          loadingText="Convertendo..."
        >
          <Repeat className="mr-1 size-4" />
          Converter em recorrente
        </BaseButton>
      </div>
    </li>
  );
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
            <SubscriptionRow
              key={`${candidate.title}-${candidate.categoryId}-${candidate.firstDate}`}
              candidate={candidate}
            />
          ))}
        </ul>
      )}
    </Section>
  );
};
