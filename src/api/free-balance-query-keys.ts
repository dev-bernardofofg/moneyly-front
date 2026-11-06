import { getGetAccountsQueryKey } from '@/api/generated/hooks/accounts/accounts';
import {
  getGetOverviewDashboardQueryKey,
  getGetOverviewForecastQueryKey,
} from '@/api/generated/hooks/overview/overview';

export const freeBalanceQueryKeys = () => [
  getGetOverviewForecastQueryKey(),
  getGetOverviewDashboardQueryKey(),
  getGetAccountsQueryKey(),
];
