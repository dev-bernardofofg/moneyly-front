import { useAuth } from '@/contexts/auth-provider';

export const useProfileAction = () => {
  const { user } = useAuth();

  const financeDefaultValues = {
    financialDayStart: user?.financialDayStart?.toString() ?? '',
    financialDayEnd: user?.financialDayEnd?.toString() ?? '',
  };

  return { user, financeDefaultValues };
};
