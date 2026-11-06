import { Section } from '@/components/cards/section';
import { BaseButton } from '@/components/clickable/base-button';
import { BaseDialog } from '@/components/portals/base-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { buttonVariants } from '@/components/ui/button';
import { UpsertOvertimeForm } from '@/forms/upsert-overtime.form';
import type { Account } from '@/api/generated/types/Account';
import type { ForecastResponse } from '@/api/generated/types/ForecastResponse';
import { FN_UTILS_DATE } from '@/lib/date';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { CircleGauge, WalletCards } from 'lucide-react';
import Link from 'next/link';
import { describeFreshness } from './freshness.helpers';

interface FreeBalanceSectionProps {
  forecast?: ForecastResponse;
  accounts?: Account[];
  accountsLoading?: boolean;
  accountsError?: boolean;
  today: Date;
  loading: boolean;
  error: boolean;
  // Sem frescor nem ações: usado onde só o valor importa (onboarding).
  compact?: boolean;
}

const confidenceLabel = {
  low: 'baixa',
  medium: 'média',
  high: 'alta',
} as const;

const money = FN_UTILS_NUMBERS.formatCurrency;

export const FreeBalanceSection = ({
  forecast,
  accounts,
  accountsLoading = false,
  accountsError = false,
  today,
  loading,
  error,
  compact = false,
}: FreeBalanceSectionProps) => {
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
          Não foi possível calcular quanto está livre para gastar.
        </p>
      </Section>
    );
  }

  const { freeBalance } = forecast;
  const { nextPayment } = freeBalance;
  const isNegative = freeBalance.total < 0;

  return (
    <Section Icon={WalletCards} title="Saldo Livre">
      <div className="rounded-xl bg-primary/10 p-4">
        <p
          className={cn(
            'text-3xl font-bold tabular-nums',
            isNegative ? 'text-expense-strong' : 'text-income-strong'
          )}
        >
          {money(freeBalance.total)}
        </p>
        <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
          até {FN_UTILS_DATE.formatInBusinessTZ(freeBalance.until, 'dd/MM')}
        </p>
        {!compact &&
          (accountsLoading ? (
            <Skeleton className="mt-2 h-5 w-56" aria-label="Carregando contas" />
          ) : accountsError ? (
            <p role="alert" className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Não foi possível carregar as contas.
            </p>
          ) : (
            accounts && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {describeFreshness(accounts, today)}
              </p>
            )
          ))}

        <dl className="mt-4 space-y-1 text-sm">
          {nextPayment && (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-slate-600 dark:text-slate-300">Próximo pagamento</dt>
              <dd className="text-right font-medium tabular-nums">
                salário {money(nextPayment.salary)} + horas {money(nextPayment.overtime)}
              </dd>
            </div>
          )}
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-slate-600 dark:text-slate-300">Já comprometido depois</dt>
            <dd className="font-medium tabular-nums">{money(freeBalance.committedAfter)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1">
            <CircleGauge className="size-4" aria-hidden />
            Confiança {confidenceLabel[freeBalance.confidence]}
          </span>
          {/* O detalhamento (contas, entradas, recorrentes, faturas) mora em /insights. */}
          <Link
            href={ROUTES.INSIGHTS}
            className="ml-auto font-medium text-primary-strong underline-offset-2 hover:underline"
          >
            Ver como é calculado
          </Link>
        </div>

        {!compact && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link href={ROUTES.CHECK_IN} className={buttonVariants({ variant: 'default' })}>
              Fazer check-in
            </Link>
            <BaseDialog
              title="Registrar horas"
              description="Registre horas extras sem sair do início"
              trigger={<BaseButton variant="outline">Registrar horas</BaseButton>}
            >
              <UpsertOvertimeForm />
            </BaseDialog>
          </div>
        )}
      </div>
    </Section>
  );
};
