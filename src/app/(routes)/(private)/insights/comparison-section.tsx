'use client';

import { Section } from '@/app/(components)/(bases)/(cards)/section';
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import { useGetOverviewInsightsComparison } from '@/app/(resources)/(generated)/hooks/overview/overview';
import type { ComparativeInsights } from '@/app/(resources)/(generated)/types/ComparativeInsights';
import { ArrowDownRight, ArrowUpRight, Minus, Scale } from 'lucide-react';

type Signal = ComparativeInsights['totals']['signal'];

// up = despesa subiu = ruim (vermelho); down = caiu = bom (verde); stable = neutro.
const signalUi = (signal: Signal) => {
  switch (signal) {
    case 'up':
      return { Icon: ArrowUpRight, className: 'text-expense' };
    case 'down':
      return { Icon: ArrowDownRight, className: 'text-income' };
    default:
      return { Icon: Minus, className: 'text-muted-foreground' };
  }
};

const formatDelta = (value: number | null) =>
  value == null ? '—' : `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

export const ComparisonSection = () => {
  const { data, isLoading } = useGetOverviewInsightsComparison();
  const comparison = data?.data;

  const totals = comparison?.totals;
  const byCategory = comparison?.byCategory ?? [];
  const highlights = comparison?.highlights ?? [];
  const totalsUi = totals && signalUi(totals.signal);

  return (
    <Section
      Icon={Scale}
      title={`Comparativo vs média${
        comparison?.basis ? ` (${comparison.basis.periodsCompared} períodos)` : ''
      }`}
    >
      {isLoading ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Carregando...</p>
      ) : !comparison || byCategory.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Sem histórico suficiente para comparar.
        </p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
            <div>
              <p className="text-sm text-muted-foreground">Despesa do período</p>
              <p className="text-lg font-bold">
                {FN_UTILS_NUMBERS.formatCurrency(totals?.currentExpense ?? 0)}
              </p>
              <p className="text-xs text-muted-foreground">
                média {FN_UTILS_NUMBERS.formatCurrency(totals?.averageExpense ?? 0)}
              </p>
            </div>
            {totalsUi && (
              <div className={`flex items-center gap-1 font-semibold ${totalsUi.className}`}>
                <totalsUi.Icon className="size-5" />
                {formatDelta(totals?.deltaPct ?? null)}
              </div>
            )}
          </div>

          {highlights.length > 0 && (
            <ul className="space-y-1">
              {highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="rounded-md border-l-2 border-l-primary bg-primary/5 px-3 py-2 text-sm"
                >
                  {highlight}
                </li>
              ))}
            </ul>
          )}

          <ul className="divide-y divide-slate-200 dark:divide-slate-700">
            {byCategory.map((category) => {
              const categoryUi = signalUi(category.signal);
              return (
                <li
                  key={category.categoryId}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900 dark:text-slate-100">
                      {category.categoryName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{category.message}</p>
                  </div>
                  <div className="flex items-center gap-3 whitespace-nowrap">
                    <span className="text-sm">
                      {FN_UTILS_NUMBERS.formatCurrency(category.currentExpense)}
                    </span>
                    <span
                      className={`flex items-center gap-0.5 text-sm font-semibold ${categoryUi.className}`}
                    >
                      <categoryUi.Icon className="size-4" />
                      {formatDelta(category.deltaPct)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Section>
  );
};
