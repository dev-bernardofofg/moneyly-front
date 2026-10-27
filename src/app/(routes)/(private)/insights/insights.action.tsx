import { usePeriod } from '@/contexts/period-provider';
import {
  useGetOverviewForecast,
  useGetOverviewInsights,
} from '@/api/generated/hooks/overview/overview';
import { keepPreviousData } from '@tanstack/react-query';

export const useInsightsAction = () => {
  const { selectedPeriodId } = usePeriod();
  const params = { periodId: selectedPeriodId || undefined };
  // Ao trocar de período, mantém a tela anterior até chegar a nova (sem piscar skeleton).
  const query = { placeholderData: keepPreviousData };

  const insights = useGetOverviewInsights(params, { query });
  const forecast = useGetOverviewForecast(params, { query });

  return {
    insights: insights.data?.data,
    insightsLoading: insights.isLoading,
    insightsError: insights.isError,
    forecast: forecast.data?.data,
    forecastLoading: forecast.isLoading,
    forecastError: forecast.isError,
  };
};
