'use client';

import type { FinancialInsights } from '@/api/generated/types/FinancialInsights';
import { Section } from '@/components/cards/section';
import { Skeleton } from '@/components/ui/skeleton';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { cn } from '@/lib/utils';
import { PieChart } from 'lucide-react';
import { foldCategories, formatPercent, type InsightCategory } from './insights.helpers';

const TITLE = 'Para onde foi o dinheiro?';
const money = FN_UTILS_NUMBERS.formatCurrency;

// Comparação em texto (seta + palavra), não só cor.
const versusAverage = (category: InsightCategory) => {
  if (category.averageAmount === null) return null;
  if (category.averageAmount === 0) return { text: 'novo neste período', className: '' };
  if (category.signal === 'stable' || category.deltaPct === null) {
    return { text: 'na média', className: '' };
  }
  return category.signal === 'up'
    ? { text: `↑ ${formatPercent(category.deltaPct)} vs média`, className: 'text-expense' }
    : { text: `↓ ${formatPercent(category.deltaPct)} vs média`, className: 'text-income' };
};

const Row = ({
  name,
  amount,
  share,
  note,
}: {
  name: string;
  amount: number;
  share: number;
  note?: { text: string; className: string } | null;
}) => (
  <li className="space-y-1">
    <div className="flex items-baseline justify-between gap-3 text-sm">
      <span className="min-w-0 truncate font-medium">{name}</span>
      <span className="shrink-0 font-semibold tabular-nums">{money(amount)}</span>
    </div>
    {/* Uma cor só: aqui a barra mede tamanho, não identifica série. */}
    <div className="h-2 w-full overflow-hidden rounded bg-muted" aria-hidden>
      <div className="h-full rounded bg-primary-strong" style={{ width: `${share}%` }} />
    </div>
    <p className="text-xs text-muted-foreground">
      {share.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}% dos gastos
      {note && (
        <>
          {' · '}
          <span className={cn('font-medium', note.className)}>{note.text}</span>
        </>
      )}
    </p>
  </li>
);

interface SpendingByCategorySectionProps {
  insights?: FinancialInsights;
  loading: boolean;
  error: boolean;
}

export const SpendingByCategorySection = ({
  insights,
  loading,
  error,
}: SpendingByCategorySectionProps) => {
  if (loading) {
    return (
      <Section Icon={PieChart} title={TITLE} className="p-3" classNameHeader="p-3">
        <div className="space-y-3" aria-label="Carregando gastos por categoria">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </Section>
    );
  }

  if (error || !insights) {
    return (
      <Section Icon={PieChart} title={TITLE} className="p-3" classNameHeader="p-3">
        <p role="alert" className="py-5 text-sm text-muted-foreground">
          Não foi possível carregar os gastos por categoria.
        </p>
      </Section>
    );
  }

  const { top, other } = foldCategories(insights.categories);

  return (
    <Section Icon={PieChart} title={TITLE} className="p-3" classNameHeader="p-3">
      {top.length === 0 ? (
        <p className="py-5 text-sm text-muted-foreground">Nenhum gasto neste período.</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {money(insights.spending.expense)} em {insights.categories.length}{' '}
            {insights.categories.length === 1 ? 'categoria' : 'categorias'}
          </p>
          <ul className="space-y-3" aria-label="Gastos por categoria">
            {top.map((category) => (
              <Row
                key={category.categoryId}
                name={category.name}
                amount={category.amount}
                share={category.share}
                note={versusAverage(category)}
              />
            ))}
            {other && (
              <Row name={`Outras (${other.count})`} amount={other.amount} share={other.share} />
            )}
          </ul>
        </div>
      )}
    </Section>
  );
};
