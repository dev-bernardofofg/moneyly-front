'use client';

import { Header } from '@/components/layout/header';
import { PeriodNavigatorWrapper } from '@/components/layout/period-navigator-wrapper';
import { Fade } from '@/components/motions/fade';
import { StaggeredFade } from '@/components/motions/staggered-fade';
import { AdjustmentsSection } from './adjustments-section';
import { FreeBalanceBreakdownSection } from './free-balance-breakdown-section';
import { useInsightsAction } from './insights.action';
import { SpendingByCategorySection } from './spending-by-category-section';
import { SpendingHistorySection } from './spending-history-section';

// Uma pergunta por bloco, todos sobre o período selecionado no topo.
const InsightsPage = () => {
  const { insights, insightsLoading, insightsError, forecast, forecastLoading, forecastError } =
    useInsightsAction();

  return (
    <Fade>
      <Header title="Insights" />
      <StaggeredFade variant="page" className="grid content-start gap-2 overflow-y-auto p-1">
        <PeriodNavigatorWrapper />
        <FreeBalanceBreakdownSection
          forecast={forecast}
          loading={forecastLoading}
          error={forecastError}
        />
        <div className="grid gap-2 lg:grid-cols-2">
          <SpendingHistorySection
            insights={insights}
            loading={insightsLoading}
            error={insightsError}
          />
          <SpendingByCategorySection
            insights={insights}
            loading={insightsLoading}
            error={insightsError}
          />
        </div>
        <AdjustmentsSection categories={insights?.categories ?? []} />
      </StaggeredFade>
    </Fade>
  );
};

export default InsightsPage;
