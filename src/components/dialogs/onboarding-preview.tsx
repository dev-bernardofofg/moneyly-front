'use client';

import { useGetOverviewForecast } from '@/api/generated/hooks/overview/overview';
import { FreeBalanceSection } from '@/app/(routes)/(private)/dashboard/free-balance-section';

export const OnboardingPreview = () => {
  // Cache do dashboard (aberto atrás do dialog) é anterior aos cadastros do wizard.
  const { data, isLoading, isError } = useGetOverviewForecast(undefined, {
    query: { refetchOnMount: 'always' },
  });

  return (
    <div className="space-y-3">
      <FreeBalanceSection forecast={data?.data} loading={isLoading} error={isError} />
      <p className="text-sm text-muted-foreground">
        O Saldo Livre é quanto você pode gastar até o fim do período sem comprometer contas,
        orçamentos e metas. Ele muda sempre que você registra uma transação, conta recorrente ou
        hora extra.
      </p>
    </div>
  );
};
