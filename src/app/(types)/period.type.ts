export interface Period {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  transactionCount: number;
  isCurrent?: boolean;
}

export interface PeriodNavigatorProps {
  periods: Period[];
  selectedPeriodId: string;
  onPeriodSelect: (periodId: string) => void;
  loading?: boolean;
}

export interface PeriodsResponse {
  success: boolean;
  message: string;
  data: Period[];
}

export interface PeriodParams {
  periodId?: string;
}
