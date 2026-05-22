import { AlertTriangle, CheckCircle, type LucideIcon, TriangleAlert, XCircle } from 'lucide-react';

export interface BudgetLevel {
  label: string;
  badgeClass: string;
  barClass: string;
  iconClass: string;
  Icon: LucideIcon;
}

const BUDGET_LEVELS: ReadonlyArray<BudgetLevel & { threshold: number }> = [
  {
    threshold: 100,
    label: 'Limite excedido',
    badgeClass: 'bg-critical text-critical-foreground',
    barClass: 'bg-critical',
    iconClass: 'text-critical',
    Icon: XCircle,
  },
  {
    threshold: 90,
    label: 'Limite crítico',
    badgeClass: 'bg-danger text-danger-foreground',
    barClass: 'bg-danger',
    iconClass: 'text-danger',
    Icon: TriangleAlert,
  },
  {
    threshold: 75,
    label: 'Atenção',
    badgeClass: 'bg-warn text-warn-foreground',
    barClass: 'bg-warn',
    iconClass: 'text-warn',
    Icon: AlertTriangle,
  },
  {
    threshold: 0,
    label: 'No controle',
    badgeClass: 'bg-ok text-ok-foreground',
    barClass: 'bg-ok',
    iconClass: 'text-ok',
    Icon: CheckCircle,
  },
] as const;

const NO_DATA_LEVEL: BudgetLevel = {
  label: 'Sem dados',
  badgeClass: 'bg-muted text-muted-foreground',
  barClass: 'bg-muted',
  iconClass: 'text-muted-foreground',
  Icon: CheckCircle,
};

export const getBudgetLevel = (percentage: number, hasData = true): BudgetLevel => {
  if (!hasData) return NO_DATA_LEVEL;
  return (
    BUDGET_LEVELS.find((level) => percentage >= level.threshold) ??
    BUDGET_LEVELS[BUDGET_LEVELS.length - 1]
  );
};
