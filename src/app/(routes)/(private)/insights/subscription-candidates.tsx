'use client';

import { BaseButton } from '@/components/clickable/base-button';
import { FN_UTILS_DATE } from '@/lib/date';
import { getErrorMessage } from '@/lib/errors';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import {
  getGetRecurringTransactionsQueryKey,
  useGetRecurringTransactions,
  usePostRecurringTransactionsFromSubscription,
} from '@/api/generated/hooks/recurring-transactions/recurring-transactions';
import {
  getGetTransactionsSubscriptionsQueryKey,
  useGetTransactionsSubscriptions,
} from '@/api/generated/hooks/transactions/transactions';
import type { SubscriptionCandidate } from '@/api/generated/types/SubscriptionCandidate';
import { CustomAxiosError } from '@/types/error.type';
import { FN_UTILS_STRING } from '@/lib/string';
import { useQueryClient } from '@tanstack/react-query';
import { Repeat } from 'lucide-react';
import { toast } from 'sonner';

const CADENCE_LABEL: Record<SubscriptionCandidate['cadence'], string> = {
  weekly: 'Semanal',
  monthly: 'Mensal',
  yearly: 'Anual',
};

export const SubscriptionRow = ({ candidate }: { candidate: SubscriptionCandidate }) => {
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
        // Invalidar recorrentes faz a recém-criada entrar no filtro de títulos da
        // Section — o candidato some da lista na hora, mesmo que o detector ainda o retorne.
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
    <li className="flex flex-wrap items-center justify-between gap-3 py-3">
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

/** Candidatos a assinatura ainda não cadastrados como recorrência. */
export const useSubscriptionCandidates = () => {
  const { data, isLoading: isLoadingCandidates } = useGetTransactionsSubscriptions();
  // Candidato cujo título normalizado bate com recorrente ativa já foi convertido
  // (o back 409aria) — a heurística do detector ainda o lista porque as transações
  // antigas não ganham vínculo retroativo. Escondemos no client.
  const { data: recurringData, isLoading: isLoadingRecurring } = useGetRecurringTransactions({
    limit: 100,
  });

  const activeRecurringTitles = new Set(
    (recurringData?.data ?? []).map((r) => FN_UTILS_STRING.normalizeTitle(r.title))
  );
  const candidates = (data?.data ?? []).filter(
    (candidate) => !activeRecurringTitles.has(FN_UTILS_STRING.normalizeTitle(candidate.title))
  );
  return { candidates, isLoading: isLoadingCandidates || isLoadingRecurring };
};
