import { Section } from '@/components/cards/section';
import { FN_UTILS_DATE } from '@/lib/date';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Info, WalletCards } from 'lucide-react';
import { buildFreeBalanceMessages, isHistoricalPeriod } from './free-balance-messages';

interface FreeBalanceBreakdownSectionProps {
  forecast?: ForecastResponse;
  loading: boolean;
  error: boolean;
}

const money = FN_UTILS_NUMBERS.formatCurrency;

const Line = ({ label, value, sign }: { label: string; value: number; sign: '+' | '−' }) => {
  // Saldo realizado pode vir negativo: inverte o sinal em vez de exibir "+ -R$".
  const shownSign = value < 0 ? (sign === '+' ? '−' : '+') : sign;
  return (
    <li className="flex items-center justify-between gap-3 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={cn('font-medium tabular-nums', shownSign === '−' && 'text-expense')}>
        {shownSign} {money(Math.abs(value))}
      </span>
    </li>
  );
};

export const FreeBalanceBreakdownSection = ({
  forecast,
  loading,
  error,
}: FreeBalanceBreakdownSectionProps) => {
  if (loading) {
    return (
      <Section Icon={WalletCards} title="Como o Saldo Livre é calculado" className="p-2">
        <div className="space-y-3" aria-label="Carregando detalhamento do saldo livre">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-40 w-full" />
        </div>
      </Section>
    );
  }

  if (error || !forecast) {
    return (
      <Section Icon={WalletCards} title="Como o Saldo Livre é calculado" className="p-2">
        <p role="alert" className="py-5 text-sm text-muted-foreground">
          Não foi possível detalhar o Saldo Livre deste período.
        </p>
      </Section>
    );
  }

  const { freeBalance, projected } = forecast;
  const { components } = freeBalance;
  const historical = isHistoricalPeriod(forecast);
  const messages = buildFreeBalanceMessages(forecast);

  return (
    <Section
      Icon={WalletCards}
      title="Como o Saldo Livre é calculado"
      className="p-2"
      classNameHeader="p-3"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            <Line label="Saldo realizado" value={components.realizedBalance} sign="+" />
            <Line
              label="Entradas recorrentes previstas"
              value={components.futureRecurringIncome}
              sign="+"
            />
            <Line
              label="Horas extras pendentes"
              value={components.pendingVariableIncome}
              sign="+"
            />
            <Line
              label="Contas recorrentes a pagar"
              value={components.futureRecurringExpense}
              sign="−"
            />
            <Line label="Reserva de orçamentos" value={components.budgetReserve} sign="−" />
            <Line label="Reserva de metas" value={components.goalReserve} sign="−" />
          </ul>
          <div className="mt-2 flex items-center justify-between border-t-2 border-slate-300 pt-3 dark:border-slate-600">
            <span className="font-semibold">
              {historical ? 'Saldo Livre ao fim do período' : 'Saldo Livre'}
            </span>
            <span
              className={cn(
                'text-xl font-bold tabular-nums',
                freeBalance.total < 0 ? 'text-expense' : 'text-income'
              )}
            >
              {money(freeBalance.total)}
            </span>
          </div>

          <ul className="mt-4 space-y-2" aria-label="Explicações do Saldo Livre">
            {messages.map((message) => (
              <li key={message} className="flex gap-2 text-sm">
                <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
                <span>{message}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Próximas ocorrências</h3>
          {projected.occurrences.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma conta ou entrada recorrente prevista até o fim do período.
            </p>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {projected.occurrences.map((occurrence) => (
                <li
                  key={`${occurrence.recurringTransactionId}-${occurrence.date}`}
                  className="flex items-center justify-between gap-3 py-2 text-sm"
                >
                  <span className="min-w-0 truncate">
                    <span className="mr-2 tabular-nums text-muted-foreground">
                      {FN_UTILS_DATE.formatInBusinessTZ(occurrence.date, 'dd/MM')}
                    </span>
                    {occurrence.title}
                  </span>
                  <span
                    className={cn(
                      'font-medium tabular-nums',
                      occurrence.type === 'expense' ? 'text-expense' : 'text-income'
                    )}
                  >
                    {occurrence.type === 'expense' ? '−' : '+'} {money(occurrence.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Section>
  );
};
