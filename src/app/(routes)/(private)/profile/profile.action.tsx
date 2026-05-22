import { useAuth } from '@/app/(contexts)/auth-provider';

export const useProfileAction = () => {
  const { user } = useAuth();

  const financeDefaultValues = {
    financialDayStart: user?.financialDayStart?.toString() ?? '',
    financialDayEnd: user?.financialDayEnd?.toString() ?? '',
    monthlyIncome: user?.monthlyIncome?.toString() ?? '',
  };

  return { user, financeDefaultValues };
};
