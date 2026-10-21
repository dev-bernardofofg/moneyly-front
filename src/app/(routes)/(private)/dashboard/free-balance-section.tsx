import { Section } from '@/components/cards/section';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CalendarDays, CircleGauge, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';

interface FreeBalanceSectionProps {
  forecast?: ForecastResponse;
  loading: boolean;
  error: boolean;
}

const confidenceLabel = {
  low: 'baixa',
  medium: 'média',
  high: 'alta',
} as const;

export const FreeBalanceSection = ({ forecast, loading, error }: FreeBalanceSectionProps) => {
  if (loading) {
    return (
      <Section Icon={WalletCards} title="Saldo Livre">
        <div className="space-y-4" aria-label="Carregando saldo livre">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Section>
    );
  }

  if (error || !forecast) {
    return (
      <Section Icon={WalletCards} title="Saldo Livre">
        <p role="alert" className="py-5 text-sm text-muted-foreground">
          Não foi possível calcular quanto está livre para gastar neste período.
        </p>
      </Section>
    );
  }

  const { freeBalance } = forecast;
  const isNegative = freeBalance.total < 0;

  return (
    <Section Icon={WalletCards} title="Saldo Livre">
      <div className="rounded-xl bg-primary/10 p-4">
        <p className="text-sm font-medium text-muted-foreground">
          Você pode gastar até o fim do período
        </p>
        <p
          className={cn(
            'mt-2 text-3xl font-bold tabular-nums',
            isNegative ? 'text-expense' : 'text-income'
          )}
        >
          {FN_UTILS_NUMBERS.formatCurrency(freeBalance.total)}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CalendarDays className="size-4" aria-hidden />
            {freeBalance.daysRemaining} dias restantes
          </span>
          <span className="flex items-center gap-1">
            <CircleGauge className="size-4" aria-hidden />
            Confiança {confidenceLabel[freeBalance.confidence]}
          </span>
          {/* O detalhamento (renda, contas, reservas) mora em /insights. */}
          <Link
            href={ROUTES.INSIGHTS}
            className="ml-auto font-medium text-primary underline-offset-2 hover:underline"
          >
            Ver como é calculado
          </Link>
        </div>
      </div>
    </Section>
  );
};
