import { Section } from '@/components/cards/section';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import type { CardBills } from '@/api/generated/types/CardBills';
import { ROUTES } from '@/lib/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';
import { BillPaymentStatus } from './bill-payment-status';
import { billSegments, buildCategoryColors } from './card-bills.helpers';

interface CardBillsSectionProps {
  data?: CardBills;
  loading: boolean;
  error: boolean;
}

const money = FN_UTILS_NUMBERS.formatCurrency;

type BillLimit = NonNullable<CardBills['bills'][number]['limit']>;

// Usado = faturas a vencer e não pagas (inclui parcelas futuras), não só a deste período.
const CardLimit = ({ limit }: { limit: BillLimit }) => {
  const usedPct = Math.min(100, Math.max(0, (limit.used / limit.total) * 100));
  return (
    <div className="space-y-1">
      <div
        className="h-1.5 w-full overflow-hidden rounded bg-muted"
        role="meter"
        aria-label="Limite usado"
        aria-valuemin={0}
        aria-valuemax={limit.total}
        aria-valuenow={limit.used}
      >
        <span
          className={cn('block h-full rounded', usedPct >= 90 ? 'bg-expense' : 'bg-primary')}
          style={{ width: `${usedPct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Limite: <span className="font-medium text-foreground">{money(limit.available)}</span>{' '}
        disponível de {money(limit.total)}
      </p>
    </div>
  );
};

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
            className="font-medium text-primary-strong underline-offset-2 hover:underline"
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
              <BillPaymentStatus bill={bill} />
              {bill.limit && <CardLimit limit={bill.limit} />}

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
