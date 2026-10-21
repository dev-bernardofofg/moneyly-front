import { useAuth } from '@/contexts/auth-provider';

export const useInitialConfig = () => {
  const { user } = useAuth();

  const needsInitialConfig = () => {
    if (!user) return false;

    return (
      !user.monthlyIncome ||
      user.financialDayStart === undefined ||
      user.financialDayEnd === undefined
    );
  };

  return {
    needsInitialConfig: needsInitialConfig(),
  };
};
