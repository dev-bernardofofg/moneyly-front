import { Section } from '@/components/cards/section';
import { FN_UTILS_DATE } from '@/lib/date';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { ChevronDown, Info, WalletCards } from 'lucide-react';
import { buildFreeBalanceMessages, isHistoricalPeriod } from './free-balance-messages';
import { dailyAllowance, freeBalanceComposition } from './insights.helpers';

interface FreeBalanceBreakdownSectionProps {
  forecast?: ForecastResponse;
  loading: boolean;
  error: boolean;
}

const TITLE = 'Quanto ainda posso gastar';
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

const CompositionBar = ({ forecast }: { forecast: ForecastResponse }) => {
  const { periodMoney, base, shortfall, segments } = freeBalanceComposition(forecast);
  if (base <= 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        {periodMoney > 0
          ? `Do dinheiro deste período (${money(periodMoney)}), veja o que já tem destino:`
          : 'As contas e reservas do período já passam do dinheiro disponível:'}
      </p>
      {/* 2px de gap separa as fatias; a legenda com valores é o rótulo (a cor nunca é a única pista). */}
      <div className="flex h-3 w-full gap-0.5 overflow-hidden rounded" aria-hidden>
        {segments.map((segment) => (
          <span
            key={segment.key}
            className="h-full first:rounded-l last:rounded-r"
            style={{ width: `${(segment.value / base) * 100}%`, backgroundColor: segment.color }}
          />
        ))}
      </div>
      <ul className="grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2" aria-label="Destino do dinheiro">
        {segments.map((segment) => (
          <li key={segment.key} className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: segment.color }}
              aria-hidden
            />
            <span className="min-w-0 flex-1 text-muted-foreground">{segment.label}</span>
            <span className="font-medium tabular-nums">{money(segment.value)}</span>
          </li>
        ))}
      </ul>
      {shortfall > 0 && (
        <p className="text-sm text-expense">
          Faltam {money(shortfall)} para cobrir tudo até o fim do período.
        </p>
      )}
    </div>
  );
};

export const FreeBalanceBreakdownSection = ({
  forecast,
  loading,
  error,
}: FreeBalanceBreakdownSectionProps) => {
  if (loading) {
    return (
      <Section Icon={WalletCards} title={TITLE} className="p-2">
        <div className="space-y-3" aria-label="Carregando detalhamento do saldo livre">
          <Skeleton className="h-12 w-56" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Section>
    );
  }

  if (error || !forecast) {
    return (
      <Section Icon={WalletCards} title={TITLE} className="p-2">
        <p role="alert" className="py-5 text-sm text-muted-foreground">
          Não foi possível detalhar o Saldo Livre deste período.
        </p>
      </Section>
    );
  }

  const { freeBalance, projected, period } = forecast;
  const { components } = freeBalance;
  const historical = isHistoricalPeriod(forecast);
  const messages = buildFreeBalanceMessages(forecast);
  const perDay = historical ? null : dailyAllowance(freeBalance.total, freeBalance.daysRemaining);

  return (
    <Section Icon={WalletCards} title={TITLE} className="p-3" classNameHeader="p-3">
      <div className="space-y-5">
        <div>
          <p className="text-sm text-muted-foreground">
            {historical
              ? 'Sobrou livre no fim do período'
              : `Livre para gastar até ${FN_UTILS_DATE.formatInBusinessTZ(period.endDate, 'dd/MM')}`}
          </p>
          {/* Figura principal da tela: algarismos proporcionais, sem tabular-nums. */}
          <p
            className={cn(
              'text-5xl font-bold',
              freeBalance.total < 0 ? 'text-expense' : 'text-income'
            )}
          >
            {money(freeBalance.total)}
          </p>
          {perDay !== null && (
            <p className="mt-1 text-sm text-muted-foreground">
              Cerca de <span className="font-medium text-foreground">{money(perDay)} por dia</span>{' '}
              nos próximos {freeBalance.daysRemaining}{' '}
              {freeBalance.daysRemaining === 1 ? 'dia' : 'dias'}.
            </p>
          )}
        </div>

        <CompositionBar forecast={forecast} />

        <ul className="space-y-2" aria-label="Explicações do Saldo Livre">
          {messages.map((message) => (
            <li key={message} className="flex gap-2 text-sm">
              <Info className="mt-0.5 size-4 shrink-0 text-primary-strong" aria-hidden />
              <span>{message}</span>
            </li>
          ))}
        </ul>

        <details className="group rounded-lg border border-slate-200 dark:border-slate-700">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-sm font-medium">
            Ver o cálculo completo
            <ChevronDown
              className="size-4 text-muted-foreground transition-transform group-open:rotate-180"
              aria-hidden
            />
          </summary>
          <div className="grid gap-4 border-t border-slate-200 p-3 dark:border-slate-700 lg:grid-cols-2">
            <div>
              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {components.carryOverBalance !== 0 && (
                  <Line label="Saldo anterior" value={components.carryOverBalance} sign="+" />
                )}
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
                    'font-bold tabular-nums',
                    freeBalance.total < 0 ? 'text-expense' : 'text-income'
                  )}
                >
                  {money(freeBalance.total)}
                </span>
              </div>
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
        </details>
      </div>
    </Section>
  );
};
