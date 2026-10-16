import { Section } from '@/app/(components)/(bases)/(cards)/section';
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import type { PlannerOverview } from '@/app/(resources)/(generated)/types/PlannerOverview';
import { Skeleton } from '@/components/ui/skeleton';
import { PiggyBank, Target, WalletCards } from 'lucide-react';

interface FreeBalanceImpactSectionProps {
  impact?: PlannerOverview['freeBalanceImpact'];
  loading: boolean;
  error: boolean;
}

const Reserve = ({ label, value, Icon }: { label: string; value: number; Icon: typeof Target }) => (
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

export const FreeBalanceImpactSection = ({
  impact,
  loading,
  error,
}: FreeBalanceImpactSectionProps) => {
  if (loading) {
    return (
      <Section Icon={WalletCards} title="Impacto no Saldo Livre">
        <div className="space-y-3" aria-label="Carregando impacto no saldo livre">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Section>
    );
  }

  if (error || !impact) {
    return (
      <Section Icon={WalletCards} title="Impacto no Saldo Livre">
        <p role="alert" className="py-4 text-sm text-muted-foreground">
          Não foi possível calcular quanto orçamentos e metas reservam neste período.
        </p>
      </Section>
    );
  }

  if (impact.total === 0) {
    return (
      <Section Icon={WalletCards} title="Impacto no Saldo Livre">
        <p className="py-4 text-sm text-muted-foreground">
          Nenhum orçamento ou meta está reservando valor neste período.
        </p>
      </Section>
    );
  }

  return (
    <Section Icon={WalletCards} title="Impacto no Saldo Livre">
      <p className="text-sm text-muted-foreground">Reservado do seu Saldo Livre neste período</p>
      <p className="mt-1 text-2xl font-bold tabular-nums text-expense">
        {FN_UTILS_NUMBERS.formatCurrency(impact.total)}
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <Reserve label="Restante dos orçamentos" value={impact.budgetReserve} Icon={PiggyBank} />
        <Reserve label="Contribuição sugerida às metas" value={impact.goalReserve} Icon={Target} />
      </div>
    </Section>
  );
};
