'use client';

import type { FinancialInsights } from '@/api/generated/types/FinancialInsights';
import { Section } from '@/components/cards/section';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { FN_UTILS_DATE } from '@/lib/date';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, ChevronDown, History, Minus } from 'lucide-react';
import { formatPercent } from './insights.helpers';

const TITLE = 'Estou gastando mais que o normal?';
const money = FN_UTILS_NUMBERS.formatCurrency;
const day = (iso: string) => FN_UTILS_DATE.formatInBusinessTZ(iso, 'dd/MM');

const SIGNAL = {
  up: { Icon: ArrowUpRight, word: 'acima', className: 'text-expense' },
  down: { Icon: ArrowDownRight, word: 'abaixo', className: 'text-income' },
  stable: { Icon: Minus, word: 'dentro', className: 'text-muted-foreground' },
} as const;

const Headline = ({ insights }: { insights: FinancialInsights }) => {
  const { spending, period } = insights;
  const ui = SIGNAL[spending.signal];
  const amount = period.isOpen ? spending.projectedExpense : spending.expense;

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">
        {period.isOpen ? 'Previsto para este período' : 'Gasto neste período'}
      </p>
      <p className="text-2xl font-bold">{money(amount)}</p>
      {period.isOpen && spending.upcomingExpense > 0 && (
        <p className="text-xs text-muted-foreground">
          {money(spending.expense)} já gastos + {money(spending.upcomingExpense)} em contas que
          ainda vão cair.
        </p>
      )}
      {spending.averageExpense === null ? (
        <p className="text-sm text-muted-foreground">
          Ainda não há períodos anteriores para comparar.
        </p>
      ) : (
        <p className={cn('flex items-center gap-1 text-sm font-medium', ui.className)}>
          <ui.Icon className="size-4 shrink-0" aria-hidden />
          {spending.signal === 'stable' || spending.deltaPct === null
            ? `Dentro da sua média de ${money(spending.averageExpense)}`
            : `${formatPercent(spending.deltaPct)} ${ui.word} da sua média de ${money(spending.averageExpense)}`}
        </p>
      )}
      {spending.averageExpense !== null && (
        <p className="text-xs text-muted-foreground">
          Média dos {spending.periodsCompared}{' '}
          {spending.periodsCompared === 1 ? 'período anterior' : 'períodos anteriores'} com
          lançamentos.
        </p>
      )}
    </div>
  );
};

const HistoryChart = ({ insights }: { insights: FinancialInsights }) => {
  const { history, spending } = insights;
  const average = spending.averageExpense;
  const max = Math.max(...history.map((item) => item.projectedExpense), average ?? 0, 1);
  const pct = (value: number) => `${(value / max) * 100}%`;

  return (
    <figure className="space-y-2">
      <figcaption className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-primary-strong" aria-hidden />
          Período selecionado
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-primary-strong/35" aria-hidden />
          Previsto
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-sm bg-slate-300 dark:bg-slate-600" aria-hidden />
          Períodos anteriores
        </span>
        {average !== null && (
          <span className="flex items-center gap-1.5">
            <span className="h-px w-3 bg-muted-foreground" aria-hidden />
            Média {money(average)}
          </span>
        )}
      </figcaption>

      {/* pt-5 reserva o espaço do rótulo acima da coluna mais alta; linha e colunas usam a mesma base. */}
      <div className="h-44 pt-5">
        <div className="relative flex h-full items-end justify-around border-b border-slate-200 dark:border-slate-700">
          {average !== null && (
            <div
              className="pointer-events-none absolute inset-x-0 border-t border-muted-foreground/60"
              style={{ bottom: pct(average) }}
              aria-hidden
            />
          )}
          {history.map((item) => {
            const upcoming = item.projectedExpense - item.expense;
            return (
              <Tooltip key={item.periodId}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="flex h-full min-w-6 flex-1 flex-col items-center justify-end focus-visible:outline-2 focus-visible:outline-primary"
                    aria-label={`${item.label}: gasto ${money(item.expense)}${upcoming > 0 ? `, previsto ${money(item.projectedExpense)}` : ''}`}
                  >
                    {/* Coluna de até 24px: barra fina, o resto do espaço é respiro. */}
                    <span
                      className="relative flex w-full max-w-6 flex-col gap-0.5 rounded-t"
                      style={{ height: pct(item.projectedExpense) }}
                    >
                      {item.isSelected && (
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold text-foreground">
                          {money(item.projectedExpense)}
                        </span>
                      )}
                      {upcoming > 0 && (
                        <span
                          className="w-full rounded-t bg-primary-strong/35"
                          style={{ height: `${(upcoming / item.projectedExpense) * 100}%` }}
                        />
                      )}
                      <span
                        className={cn(
                          'w-full flex-1',
                          upcoming <= 0 && 'rounded-t',
                          item.isSelected ? 'bg-primary-strong' : 'bg-slate-300 dark:bg-slate-600'
                        )}
                      />
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{item.label}</p>
                  <p>Entradas: {money(item.income)}</p>
                  <p>Gastos: {money(item.expense)}</p>
                  {upcoming > 0 && <p>Previsto: {money(item.projectedExpense)}</p>}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
      <div className="flex justify-around text-[11px] tabular-nums text-muted-foreground">
        {history.map((item) => (
          <span
            key={item.periodId}
            className={cn('flex-1 text-center', item.isSelected && 'font-semibold text-foreground')}
          >
            {day(item.startDate)}
          </span>
        ))}
      </div>

      <details className="group text-sm">
        <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-muted-foreground">
          Ver em tabela
          <ChevronDown
            className="size-3.5 transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <table className="mt-2 w-full text-left text-xs">
          <thead className="text-muted-foreground">
            <tr>
              <th className="py-1 font-medium">Período</th>
              <th className="py-1 text-right font-medium">Entradas</th>
              <th className="py-1 text-right font-medium">Gastos</th>
              <th className="py-1 text-right font-medium">Previsto</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {history.map((item) => (
              <tr key={item.periodId} className={cn(item.isSelected && 'font-semibold')}>
                <td className="py-1">
                  {day(item.startDate)} a {day(item.endDate)}
                </td>
                <td className="py-1 text-right">{money(item.income)}</td>
                <td className="py-1 text-right">{money(item.expense)}</td>
                <td className="py-1 text-right">{money(item.projectedExpense)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
};

interface SpendingHistorySectionProps {
  insights?: FinancialInsights;
  loading: boolean;
  error: boolean;
}

export const SpendingHistorySection = ({
  insights,
  loading,
  error,
}: SpendingHistorySectionProps) => (
  <Section Icon={History} title={TITLE} className="p-3" classNameHeader="p-3">
    {loading ? (
      <div className="space-y-3" aria-label="Carregando histórico de gastos">
        <Skeleton className="h-16 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    ) : error || !insights ? (
      <p role="alert" className="py-5 text-sm text-muted-foreground">
        Não foi possível carregar o histórico de gastos.
      </p>
    ) : (
      <div className="space-y-5">
        <Headline insights={insights} />
        <HistoryChart insights={insights} />
      </div>
    )}
  </Section>
);
