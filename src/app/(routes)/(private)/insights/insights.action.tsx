import {
  useGetOverviewForecast,
  useGetOverviewInsights,
} from "@/app/(resources)/(generated)/hooks/overview/overview";

export const useInsightsAction = () => {
  const { data, isLoading } = useGetOverviewInsights();
  const insights = data?.data;

  const { data: forecastData, isLoading: forecastLoading } =
    useGetOverviewForecast();
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
