import { usePeriod } from '@/app/(contexts)/period-provider';
import {
  useGetOverviewDashboard,
  useGetOverviewForecast,
} from '@/app/(resources)/(generated)/hooks/overview/overview';
import type { DashboardStats } from '@/app/(resources)/(generated)/types/DashboardStats';
import { DollarSign, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';

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
    name: 'Saldo',
    indicator: 'balance',
    icon: DollarSign,
    description: 'Saldo Disponível',
    isMonetary: true,
    variant: 'default',
  },
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

  const { data: forecastData, isLoading: forecastLoading } = useGetOverviewForecast({
    periodId: selectedPeriodId || undefined,
  });

  const forecast = forecastData?.data;
  const previews = overviewData?.data?.previews;
  const subs = previews?.subscriptions;
  const cmp = previews?.comparison;
  const recentTransactions = overviewData?.data?.recentTransactions ?? [];
  const chartSeries = overviewData?.data?.chart?.data ?? [];
  const stats = overviewData?.data?.stats;
  const transactionsCount = overviewData?.data?.transactionsCount ?? 0;

  return {
    data: {
      forecast,
      subs,
      cmp,
      recentTransactions,
      chartSeries,
      stats,
      transactionsCount,
    },
    loading: {
      isPostingOverview,
      forecastLoading,
    },
  };
};
