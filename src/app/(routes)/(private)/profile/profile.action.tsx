import { useAuth } from '@/contexts/auth-provider';
import { FN_UTILS_STRING } from '@/lib/string';

export const useProfileAction = () => {
  const { user } = useAuth();

  const financeDefaultValues = {
    financialDayStart: user?.financialDayStart?.toString() ?? '',
    financialDayEnd: user?.financialDayEnd?.toString() ?? '',
    monthlyIncome: FN_UTILS_STRING.formatCentsToMoneyInput(user?.monthlyIncome),
  };

  return { user, financeDefaultValues };
};
