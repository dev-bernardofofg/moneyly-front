declare interface Period {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  transactionCount: number;
  isCurrent?: boolean;
}

declare interface PeriodNavigatorProps {
  periods: Period[];
  selectedPeriodId: string;
  onPeriodSelect: (periodId: string) => void;
  loading?: boolean;
}

declare interface PeriodsResponse {
  success: boolean;
  message: string;
  data: Period[];
}

declare interface PeriodParams {
  periodId?: string;
}
