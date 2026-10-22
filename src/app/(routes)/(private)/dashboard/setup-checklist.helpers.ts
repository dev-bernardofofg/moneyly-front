import type { Account } from '@/api/generated/types/Account';
import type { RecurringTransaction } from '@/api/generated/types/RecurringTransaction';
import { ROUTES } from '@/lib/routes';

export interface SetupStep {
  key: string;
  text: string;
  href: string;
}

const plural = (count: number, one: string, many: string) => (count === 1 ? one : many);

/** Configurações que as features de contas e cartões precisam para dar resultado. */
export const pendingSetupSteps = (
  accounts: Account[],
  recurrences: RecurringTransaction[]
): SetupStep[] => {
  const checking = accounts.filter((account) => account.type === 'checking');
  const cards = accounts.filter((account) => account.type === 'credit_card');
  const withoutBalance = checking.filter((account) => !account.openingBalanceDate);
  const withoutLimit = cards.filter((account) => !account.creditLimit);
  // Sem cartão não há o que escolher; com cartão, despesa recorrente na conta padrão pode ser dele.
  const unassigned = cards.length
    ? recurrences.filter((rec) => rec.isActive && rec.type === 'expense' && !rec.accountId)
    : [];

  // Salário como recorrência: aparece previsto no Saldo Livre antes de cair e o extrato confirma.
  const hasRecurringIncome = recurrences.some((rec) => rec.isActive && rec.type === 'income');

  return [
    ...(hasRecurringIncome
      ? []
      : [
          {
            key: 'salary',
            text: 'Cadastre seu salário como recorrência de entrada no dia em que ele cai',
            href: ROUTES.RECURRING_TRANSACTIONS,
          },
        ]),
    ...(withoutBalance.length
      ? [
          {
            key: 'opening-balance',
            text: `Informe o saldo inicial de ${withoutBalance.length} ${plural(withoutBalance.length, 'conta', 'contas')} para ver o saldo de cada uma`,
            href: ROUTES.ACCOUNTS,
          },
        ]
      : []),
    ...(cards.length === 0
      ? [
          {
            key: 'card',
            text: 'Cadastre seu cartão para acompanhar faturas e limite',
            href: ROUTES.ACCOUNTS,
          },
        ]
      : []),
    ...(withoutLimit.length
      ? [
          {
            key: 'credit-limit',
            text: `Informe o limite de ${withoutLimit.length} ${plural(withoutLimit.length, 'cartão', 'cartões')} para ver quanto ainda está disponível`,
            href: ROUTES.ACCOUNTS,
          },
        ]
      : []),
    ...(unassigned.length
      ? [
          {
            key: 'recurring-card',
            text: `Revise ${unassigned.length} ${plural(unassigned.length, 'recorrência', 'recorrências')} na conta padrão: as cobradas no cartão contam na fatura`,
            href: ROUTES.RECURRING_TRANSACTIONS,
          },
        ]
      : []),
  ];
};
