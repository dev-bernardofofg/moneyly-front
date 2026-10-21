import { usePeriod } from '@/contexts/period-provider';
import {
  useGetOverviewCardBills,
  useGetOverviewDashboard,
  useGetOverviewForecast,
} from '@/api/generated/hooks/overview/overview';
import type { DashboardStats } from '@/api/generated/types/DashboardStats';
import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';

type StatVariant = 'default' | 'secondary' | 'destructive';

interface StatConfig {
  name: string;
  indicator: keyof DashboardStats;
  icon: LucideIcon;
  description: string;
  isMonetary?: boolean;
  variant: StatVariant;
}

export const DASHBOARD_STATS_CONFIG: StatConfig[] = [
  {
    name: 'Entradas',
    indicator: 'totalIncome',
    icon: TrendingUp,
    description: 'Entradas totais',
    isMonetary: true,
    variant: 'default',
  },
  {
    name: 'Saídas',
    indicator: 'totalExpense',
    icon: TrendingDown,
    description: 'Gastos totais',
    isMonetary: true,
    variant: 'destructive',
  },
];

export const useDashboardAction = () => {
  const { selectedPeriodId } = usePeriod();
  const { data: overviewData, isPending: isPostingOverview } = useGetOverviewDashboard({
    periodId: selectedPeriodId || undefined,
  });

  const {
    data: forecastData,
    isLoading: forecastLoading,
    isError: forecastError,
  } = useGetOverviewForecast({
    periodId: selectedPeriodId || undefined,
  });

  const {
    data: cardBillsData,
    isLoading: cardBillsLoading,
    isError: cardBillsError,
  } = useGetOverviewCardBills({ periodId: selectedPeriodId || undefined });

  const forecast = forecastData?.data;
  const previews = overviewData?.data?.previews;
  const subs = previews?.subscriptions;
  const cmp = previews?.comparison;
  const recentTransactions = overviewData?.data?.recentTransactions ?? [];
  const chartSeries = overviewData?.data?.chart?.data ?? [];
  const stats = overviewData?.data?.stats;

  return {
    data: {
      forecast,
      subs,
      cmp,
      recentTransactions,
      chartSeries,
      stats,
      cardBills: cardBillsData?.data,
    },
    loading: {
      isPostingOverview,
      forecastLoading,
      forecastError,
      cardBillsLoading,
      cardBillsError,
    },
  };
};
