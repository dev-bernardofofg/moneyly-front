import type { OvertimeRecord } from '@/api/generated/types/OvertimeRecord';
import { describe, expect, it } from 'vitest';
import {
  formatHoursLong,
  overtimeReportTotals,
  reportFileName,
  reportPeriodLabel,
} from './overtime-report.helpers';

const record = (company: string, hoursWorked: string, amount: number) =>
  ({ company: { id: company, name: company }, hoursWorked, amount }) as OvertimeRecord;

describe('overtime report helpers', () => {
  it('sums hours and amount per company, biggest first', () => {
    const totals = overtimeReportTotals([
      record('Acme', '1.50', 5250),
      record('Tech', '2.00', 9000),
      record('Acme', '0.75', 2625),
    ]);

    expect(totals).toEqual({
      hours: 4.25,
      amount: 16875,
      byCompany: [
        { name: 'Tech', hours: 2, amount: 9000, count: 1 },
        { name: 'Acme', hours: 2.25, amount: 7875, count: 2 },
      ],
    });
  });

  it('describes hours in hours and minutes', () => {
    expect(formatHoursLong(12.5)).toBe('12h 30min');
    expect(formatHoursLong(3)).toBe('3h');
    expect(formatHoursLong(0.08)).toBe('0h 05min');
  });

  it('names the period and the file', () => {
    expect(reportPeriodLabel(10, 2026)).toBe('Outubro de 2026');
    expect(reportFileName(3, 2026)).toBe('horas-extras-2026-03');
  });
});
