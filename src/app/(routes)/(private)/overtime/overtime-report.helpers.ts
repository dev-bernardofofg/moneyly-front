import type { OvertimeRecord } from '@/api/generated/types/OvertimeRecord';

export interface OvertimeReportTotals {
  hours: number;
  amount: number;
  byCompany: { name: string; hours: number; amount: number; count: number }[];
}

// Mesma conta do resumo do CSV (back): soma das linhas exportadas, respeitando o filtro.
export const overtimeReportTotals = (records: OvertimeRecord[]): OvertimeReportTotals => {
  const byCompany = new Map<string, OvertimeReportTotals['byCompany'][number]>();
  for (const record of records) {
    const entry = byCompany.get(record.company.name) ?? {
      name: record.company.name,
      hours: 0,
      amount: 0,
      count: 0,
    };
    entry.hours += Number(record.hoursWorked);
    entry.amount += record.amount;
    entry.count += 1;
    byCompany.set(record.company.name, entry);
  }
  const companies = [...byCompany.values()].sort((a, b) => b.amount - a.amount);
  return {
    hours: companies.reduce((total, company) => total + company.hours, 0),
    amount: companies.reduce((total, company) => total + company.amount, 0),
    byCompany: companies,
  };
};

/** 12.5 → "12h 30min". */
export const formatHoursLong = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const min = totalMinutes % 60;
  return min > 0 ? `${h}h ${String(min).padStart(2, '0')}min` : `${h}h`;
};

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const reportPeriodLabel = (month: number, year: number) => `${MONTHS[month - 1]} de ${year}`;

export const reportFileName = (month: number, year: number) =>
  `horas-extras-${year}-${String(month).padStart(2, '0')}`;
