import { FN_UTILS_NUMBERS } from '@/lib/number';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';

const money = FN_UTILS_NUMBERS.formatCurrency;

export const isHistoricalPeriod = (forecast: ForecastResponse) =>
  new Date(forecast.period.endDate).getTime() < new Date(forecast.asOf).getTime();

// Só lê o contrato: nenhuma regra financeira é recalculada aqui.
export const buildFreeBalanceMessages = (forecast: ForecastResponse): string[] => {
  const { total, income, components } = forecast.freeBalance;
  const reserves = components.budgetReserve + components.goalReserve;
  const messages: string[] = [];

  if (isHistoricalPeriod(forecast)) {
    messages.push('Período encerrado: o valor mostra como o período terminou.');
  }

  if (total < 0) {
    const outflows = [
      { label: 'contas futuras', value: components.futureRecurringExpense },
      { label: 'reserva de orçamentos', value: components.budgetReserve },
      { label: 'reserva de metas', value: components.goalReserve },
    ];
    const largest = outflows.reduce((max, item) => (item.value > max.value ? item : max));
    messages.push(
      largest.value > 0
        ? `Saldo Livre negativo: o maior peso vem de ${largest.label} (${money(largest.value)}).`
        : 'Saldo Livre negativo: as despesas do período já superam as entradas.'
    );
  }

  if (components.futureRecurringExpense > 0) {
    messages.push(`Suas contas futuras consomem ${money(components.futureRecurringExpense)}.`);
  }

  if (reserves > 0) {
    messages.push(`${money(reserves)} estão reservados para orçamento e metas.`);
  }

  if (income.variable > 0) {
    messages.push(`Horas extras adicionaram ${money(income.variable)} à renda do período.`);
  }

  if (income.pendingVariable > 0) {
    messages.push(
      `${money(income.pendingVariable)} de horas extras ainda não viraram transação de receita.`
    );
  }

  if (messages.length === 0) {
    messages.push('Nenhuma conta futura, reserva ou hora extra afeta este período.');
  }

  return messages;
};
