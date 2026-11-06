'use client';

import { useState } from 'react';
import { useGetOverviewForecast } from '@/api/generated/hooks/overview/overview';
import { FreeBalanceSection } from '@/app/(routes)/(private)/dashboard/free-balance-section';

export const OnboardingPreview = () => {
  // Cache do dashboard (aberto atrás do dialog) é anterior aos cadastros do wizard.
  const [today] = useState(() => new Date());
  const { data, isLoading, isError } = useGetOverviewForecast({
    query: { refetchOnMount: 'always' },
  });

  return (
    <div className="space-y-3">
      <FreeBalanceSection
        forecast={data?.data}
        today={today}
        loading={isLoading}
        error={isError}
        compact
      />
      <p className="text-sm text-muted-foreground">
        O Saldo Livre é quanto você pode gastar até receber o próximo salário sem deixar contas e
        faturas descobertas. Ele muda a cada check-in e quando você ajusta suas recorrentes.
      </p>
    </div>
  );
};
