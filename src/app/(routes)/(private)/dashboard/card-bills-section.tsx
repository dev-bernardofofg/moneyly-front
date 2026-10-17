import { Section } from '@/app/(components)/(bases)/(cards)/section';
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import type { CardBills } from '@/app/(resources)/(generated)/types/CardBills';
import { ROUTES } from '@/app/(utils)/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';
import { billSegments, buildCategoryColors } from './card-bills.helpers';

interface CardBillsSectionProps {
  data?: CardBills;
  loading: boolean;
  error: boolean;
}

const money = FN_UTILS_NUMBERS.formatCurrency;

export const CardBillsSection = ({ data, loading, error }: CardBillsSectionProps) => {
  if (loading) {
    return (
      <Section Icon={CreditCard} title="Faturas do período">
        <div className="space-y-3" aria-label="Carregando faturas">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
      </Section>
    );
  }

  if (error || !data) {
    return (
      <Section Icon={CreditCard} title="Faturas do período">
        <p role="alert" className="py-4 text-sm text-muted-foreground">
          Não foi possível carregar as faturas do período.
        </p>
      </Section>
    );
  }

  if (data.bills.length === 0) {
    return (
      <Section Icon={CreditCard} title="Faturas do período">
        <p className="py-4 text-sm text-muted-foreground">
          Nenhum cartão cadastrado.{' '}
          <Link
            href={ROUTES.ACCOUNTS}
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Cadastre um cartão
          </Link>{' '}
          para ver as faturas por categoria.
        </p>
      </Section>
    );
  }

  const colors = buildCategoryColors(data.bills);

  return (
    <Section Icon={CreditCard} title="Faturas do período">
      <p className="text-sm text-muted-foreground">Total que vence neste período</p>
      <p className="mb-4 text-2xl font-bold tabular-nums text-expense">{money(data.total)}</p>

      <ul className="space-y-4">
        {data.bills.map((bill) => {
          const segments = billSegments(bill, colors);
          return (
            <li key={bill.accountId} className="space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <span className="truncate font-medium">{bill.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  vence dia {bill.dueDay}
                </span>
                <span className="ml-auto shrink-0 font-semibold tabular-nums">
                  {money(bill.total)}
                </span>
              </div>

              {segments.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma compra nesta fatura.</p>
              ) : (
                <>
                  {/* Barra empilhada: largura = participação na fatura; 2px de gap separa as fatias. */}
                  <div
                    className="flex h-3 w-full gap-[2px] overflow-hidden rounded"
                    role="img"
                    aria-label={`${bill.name}: ${segments.map((s) => `${s.name} ${money(s.amount)}`).join(', ')}`}
                  >
                    {segments.map((segment) => (
                      <Tooltip key={segment.key}>
                        <TooltipTrigger asChild>
                          <span
                            className="h-full first:rounded-l last:rounded-r"
                            style={{
                              width: `${(segment.amount / bill.total) * 100}%`,
                              backgroundColor: segment.color,
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {segment.name}: {money(segment.amount)} (
                          {Math.round((segment.amount / bill.total) * 100)}%)
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                  {/* Legenda com valores: a cor nunca é a única pista (contraste baixo em 3 tons). */}
                  <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    {segments.map((segment) => (
                      <li key={segment.key} className="flex items-center gap-1.5">
                        <span
                          className="size-2.5 shrink-0 rounded-sm"
                          style={{ backgroundColor: segment.color }}
                          aria-hidden
                        />
                        <span className="text-muted-foreground">{segment.name}</span>
                        <span className="font-medium tabular-nums">{money(segment.amount)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
};
