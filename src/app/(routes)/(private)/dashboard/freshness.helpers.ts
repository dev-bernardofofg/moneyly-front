import type { Account } from '@/api/generated/types/Account';
import { FN_UTILS_DATE } from '@/lib/date';

const DAY_PATTERN = 'yyyy-MM-dd';
const MS_PER_DAY = 86_400_000;

// Compara dias do calendário em São Paulo, não instantes: 23h de ontem ainda é "1 dia".
const daysSince = (value: string, today: Date) => {
  const toUtcDay = (date: Date | string) =>
    Date.parse(`${FN_UTILS_DATE.formatInBusinessTZ(date, DAY_PATTERN)}T00:00:00Z`);
  return Math.max(0, Math.round((toUtcDay(today) - toUtcDay(value)) / MS_PER_DAY));
};

export const describeAccount = (account: Account, today: Date) => {
  if (!account.dataThrough) return `${account.name} sem dados`;
  if (account.freshness === 'fresh') return `${account.name} em dia`;

  const days = daysSince(account.dataThrough, today);
  return `${account.name} há ${days} ${days === 1 ? 'dia' : 'dias'}`;
};

export const describeFreshness = (accounts: Account[], today: Date): string => {
  const active = accounts.filter((account) => account.isActive);
  if (active.length === 0) return 'Nenhuma conta ativa';

  // A data mais antiga é a que limita o que o Saldo Livre sabe.
  const oldest = active
    .map((account) => account.dataThrough)
    .filter((value): value is string => value != null)
    .sort()[0];

  const head = oldest
    ? `Dados até ${FN_UTILS_DATE.formatInBusinessTZ(oldest, 'dd/MM')}`
    : 'Nenhum dado importado ainda';

  return [head, ...active.map((account) => describeAccount(account, today))].join(' · ');
};
