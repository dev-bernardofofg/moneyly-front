import { Section } from '@/app/(components)/(bases)/(cards)/section';
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import type { ForecastResponse } from '@/app/(resources)/(generated)/types/ForecastResponse';
import { Skeleton } from '@/components/ui/skeleton';
import {
  CalendarDays,
  CircleGauge,
  Landmark,
  PiggyBank,
  ReceiptText,
  WalletCards,
} from 'lucide-react';

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

const Detail = ({
  label,
  value,
  Icon,
}: {
  label: string;
  value: number;
  Icon: typeof Landmark;
}) => (
  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-background/80 p-3 dark:border-slate-700">
    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
      <Icon className="size-4" aria-hidden />
    </span>
    <div className="min-w-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="truncate font-semibold tabular-nums">
        {FN_UTILS_NUMBERS.formatCurrency(value)}
      </p>
    </div>
  </div>
);

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
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)]">
        <div className="flex flex-col justify-between rounded-xl bg-primary/10 p-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Você pode gastar até o fim do período
            </p>
            <p
              className={`mt-2 text-3xl font-bold tabular-nums ${
                isNegative ? 'text-expense' : 'text-income'
              }`}
            >
              {FN_UTILS_NUMBERS.formatCurrency(freeBalance.total)}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="size-4" aria-hidden />
              {freeBalance.daysRemaining} dias restantes
            </span>
            <span className="flex items-center gap-1">
              <CircleGauge className="size-4" aria-hidden />
              Confiança {confidenceLabel[freeBalance.confidence]}
            </span>
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <Detail label="Renda fixa considerada" value={freeBalance.income.fixed} Icon={Landmark} />
          <Detail
            label="Renda variável considerada"
            value={freeBalance.income.variable}
            Icon={WalletCards}
          />
          <Detail
            label="Contas recorrentes a pagar"
            value={freeBalance.commitments.recurringExpenses}
            Icon={ReceiptText}
          />
          <Detail
            label="Reservado para orçamento e metas"
            value={freeBalance.reserves.budgets + freeBalance.reserves.goals}
            Icon={PiggyBank}
          />
        </div>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Cálculo: saldo atual + entradas previstas − contas futuras − reservas de orçamento e metas.
      </p>
    </Section>
  );
};
