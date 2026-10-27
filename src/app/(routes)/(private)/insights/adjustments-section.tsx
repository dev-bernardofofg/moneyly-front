'use client';

import { Section } from '@/components/cards/section';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { ArrowUpRight, Lightbulb, RefreshCcw } from 'lucide-react';
import { formatPercent, risingCategories, type InsightCategory } from './insights.helpers';
import { SubscriptionRow, useSubscriptionCandidates } from './subscription-candidates';

const money = FN_UTILS_NUMBERS.formatCurrency;

/** O que dá para fazer agora. Só aparece quando há algo concreto para sugerir. */
export const AdjustmentsSection = ({ categories }: { categories: InsightCategory[] }) => {
  const { candidates, isLoading } = useSubscriptionCandidates();
  const rising = risingCategories(categories);

  if (isLoading || (rising.length === 0 && candidates.length === 0)) return null;

  return (
    <Section Icon={Lightbulb} title="O que dá para ajustar" className="p-3" classNameHeader="p-3">
      <div className="space-y-5">
        {rising.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Gastos que subiram</h3>
            <ul className="space-y-2">
              {rising.map((category) => (
                <li key={category.categoryId} className="flex gap-2 text-sm">
                  <ArrowUpRight className="mt-0.5 size-4 shrink-0 text-expense" aria-hidden />
                  <span>
                    <span className="font-medium">{category.name}</span>: {money(category.amount)},{' '}
                    {formatPercent(category.deltaPct ?? 0)} acima da sua média de{' '}
                    {money(category.averageAmount ?? 0)}.
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {candidates.length > 0 && (
          <div className="space-y-1">
            <h3 className="flex items-center gap-2 text-sm font-semibold">
              <RefreshCcw className="size-4 text-primary-strong" aria-hidden />
              Possíveis assinaturas
            </h3>
            <p className="text-xs text-muted-foreground">
              Cobranças que se repetem e ainda não são recorrências. Cadastre para elas entrarem
              previstas no Saldo Livre.
            </p>
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {candidates.map((candidate) => (
                <SubscriptionRow
                  key={`${candidate.title}-${candidate.categoryId}-${candidate.firstDate}`}
                  candidate={candidate}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </Section>
  );
};
