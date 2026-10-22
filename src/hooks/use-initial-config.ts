import { useAuth } from '@/contexts/auth-provider';

export const useInitialConfig = () => {
  const { user } = useAuth();

  const needsInitialConfig = () => {
    if (!user) return false;

    // firstAccess cai em false quando o período é configurado (PUT /user/income-and-period).
    return (
      user.firstAccess === true ||
      user.financialDayStart === undefined ||
      user.financialDayEnd === undefined
    );
  };

  return {
    needsInitialConfig: needsInitialConfig(),
  };
};
