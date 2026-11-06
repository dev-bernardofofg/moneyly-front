import { FN_UTILS_NUMBERS } from '@/lib/number';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';

const money = FN_UTILS_NUMBERS.formatCurrency;

// Só lê o contrato: nenhuma regra financeira é recalculada aqui.
export const buildFreeBalanceMessages = (forecast: ForecastResponse): string[] => {
  const { total, confidence, components } = forecast.freeBalance;
  const messages: string[] = [];

  if (total < 0) {
    const outflows = [
      { label: 'contas recorrentes', value: components.recurringExpense },
      { label: 'faturas de cartão', value: components.cardBills },
    ];
    const largest = outflows.reduce((max, item) => (item.value > max.value ? item : max));
    messages.push(
      largest.value > 0
        ? `Saldo Livre negativo: o maior peso vem de ${largest.label} (${money(largest.value)}).`
        : 'Saldo Livre negativo: o saldo das contas não cobre o que vence até o próximo salário.'
    );
  }

  if (components.recurringExpense > 0) {
    messages.push(
      `Suas contas recorrentes consomem ${money(components.recurringExpense)} até o próximo salário.`
    );
  }

  if (components.cardBills > 0) {
    messages.push(`Faturas que vencem até lá somam ${money(components.cardBills)}.`);
  }

  if (components.otherIncome > 0) {
    messages.push(`Outras entradas previstas adicionam ${money(components.otherIncome)}.`);
  }

  if (confidence === 'low') {
    messages.push('Confiança baixa: falta definir o salário ou o saldo inicial de alguma conta.');
  } else if (confidence === 'medium') {
    messages.push('Confiança média: alguma conta está com dados atrasados. Faça um check-in.');
  }

  if (messages.length === 0) {
    messages.push('Nenhuma conta, fatura ou entrada prevista até o próximo salário.');
  }

  return messages;
};
