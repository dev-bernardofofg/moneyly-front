import {
  getGetOverviewDashboardQueryKey,
  getGetOverviewForecastQueryKey,
  getGetOverviewPlannerQueryKey,
} from './(generated)/hooks/overview/overview';

// Sem params: invalida por prefixo, cobrindo todos os períodos em cache.
export const freeBalanceQueryKeys = () => [
  getGetOverviewPlannerQueryKey(),
  getGetOverviewForecastQueryKey(),
  getGetOverviewDashboardQueryKey(),
];
