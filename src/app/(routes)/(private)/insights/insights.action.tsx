import { usePeriod } from '@/app/(contexts)/period-provider';
import {
  useGetOverviewForecast,
  useGetOverviewInsights,
} from '@/app/(resources)/(generated)/hooks/overview/overview';

export const useInsightsAction = () => {
  const { selectedPeriodId } = usePeriod();
  const { data, isLoading } = useGetOverviewInsights();
  const insights = data?.data;

  const { data: forecastData, isLoading: forecastLoading } = useGetOverviewForecast({
    periodId: selectedPeriodId || undefined,
  });
  const forecast = forecastData?.data;

  return {
    insights,
    forecast,
    isLoading,
    forecastLoading,
    currentPeriod: insights?.currentPeriod,
    trend: insights?.trend,
    allTime: insights?.allTime,
    topCategories: insights?.topCategories ?? [],
  };
};
