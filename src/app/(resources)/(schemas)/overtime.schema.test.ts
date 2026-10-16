import { describe, expect, it } from 'vitest';
import { overtimeRange, UpsertOvertimeSchema } from './overtime.schema';

const BASE = { companyId: '11111111-1111-1111-1111-111111111111', date: '2026-09-10' };

describe('overtimeRange', () => {
  it('keeps start and end on the same day', () => {
    expect(overtimeRange('2026-09-10', '18:00', '21:30')).toEqual({
      startLocal: '2026-09-10T18:00',
      endLocal: '2026-09-10T21:30',
      overnight: false,
    });
  });

  it('moves the end to the next day when it is before the start', () => {
    expect(overtimeRange('2026-09-30', '22:00', '02:00')).toEqual({
      startLocal: '2026-09-30T22:00',
      endLocal: '2026-10-01T02:00',
      overnight: true,
    });
  });
});

describe('UpsertOvertimeSchema', () => {
  it('accepts a shift with date, start and end', () => {
    expect(UpsertOvertimeSchema.safeParse({ ...BASE, start: '18:00', end: '20:00' }).success).toBe(
      true
    );
  });

  it('rejects an end equal to the start', () => {
    const result = UpsertOvertimeSchema.safeParse({ ...BASE, start: '18:00', end: '18:00' });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['end']);
  });

  it('rejects a start in the future', () => {
    const result = UpsertOvertimeSchema.safeParse({
      ...BASE,
      date: '2999-01-01',
      start: '08:00',
      end: '10:00',
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['start']);
  });

  it('requires start and end times', () => {
    const result = UpsertOvertimeSchema.safeParse({ ...BASE, start: '', end: '' });

    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(['start', 'end']);
  });
});
