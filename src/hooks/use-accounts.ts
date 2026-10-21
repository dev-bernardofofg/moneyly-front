import { useGetAccounts } from '@/api/generated/hooks/accounts/accounts';

export const accountLabel = (account: { name: string; type: string }) =>
  account.type === 'credit_card' ? `${account.name} (cartão)` : account.name;

export const useAccounts = () => {
  const { data, isLoading } = useGetAccounts();
  const accounts = data?.data ?? [];

  return {
    accounts,
    isLoading,
    defaultAccountId: accounts.find((account) => account.isDefault)?.id,
    options: accounts.map((account) => ({ label: accountLabel(account), value: account.id })),
    nameById: new Map(accounts.map((account) => [account.id, accountLabel(account)])),
  };
};
