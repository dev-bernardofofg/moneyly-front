import { usePeriod } from "@/app/(contexts)/period-provider";
import { useGetOverviewDashboard, useGetOverviewForecast } from "@/app/(resources)/(generated)/hooks/overview/overview";
import { DollarSign, List, TrendingDown, TrendingUp } from "lucide-react";

export const DASHBOARD_STATS_INTERATOR = [
  {
    name: "Saldo",
    indicator: "balance",
    icon: DollarSign,
    description: "Saldo Disponível",
    isMonetary: true,
    variant: "default",
    loading: false,
  },
  {
    name: "Entradas",
    indicator: "totalIncome",
    icon: TrendingUp,
    description: "Entradas totais",
    isMonetary: true,
    variant: "default",
    loading: false,
  },
  {
    name: "Saídas",
    indicator: "totalExpense",
    icon: TrendingDown,
    description: "Gastos totais",
    isMonetary: true,
    variant: "destructive",
    loading: false,
  },
  {
    name: "Transações",
    indicator: "transactionsCount",
    icon: List,
    description: "Total de transações",
    loading: false,
  },
];

export const useDashboardAction = () => {
  const { selectedPeriodId } = usePeriod();
  const { data: overviewData, isPending: isPostingOverview } = useGetOverviewDashboard({
    periodId: selectedPeriodId || undefined,
  });

  const { data: forecastData, isLoading: forecastLoading } =
    useGetOverviewForecast(
      { periodId: selectedPeriodId || undefined },
      {
        query: {
          queryKey: ["/overview/forecast", selectedPeriodId || undefined],
        },
      }
    );
    
  const forecast = forecastData?.data;
  const previews = overviewData?.data?.previews;
  const subs = previews?.subscriptions;
  const cmp = previews?.comparison;
  const recentTransactions = overviewData?.data?.recentTransactions ?? [];
  const chartSeries = overviewData?.data?.chart?.data ?? [];
  const stats = overviewData?.data?.stats ?? {};

  return {
    data: {
      forecast,
      subs,
      cmp,
      recentTransactions,
      chartSeries,
      stats,
    },
    loading: {
      isPostingOverview,
      forecastLoading,
    },
  }
}