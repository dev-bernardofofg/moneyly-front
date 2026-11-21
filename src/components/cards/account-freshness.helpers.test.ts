import type { Account } from '@/api/generated/types/Account';
import { describe, expect, it } from 'vitest';
import { describeFreshness, describeLastImport } from './account-freshness.helpers';

const today = new Date('2026-11-11T15:00:00.000Z');

const makeAccount = (overrides: Partial<Account>): Account =>
  ({
    id: overrides.name ?? 'account',
    name: 'Conta',
    type: 'checking',
    isActive: true,
    dataThrough: null,
    freshness: 'empty',
    lastImportFrom: null,
    lastImportThrough: null,
    lastImportDueDate: null,
    ...overrides,
  }) as Account;

const inter = makeAccount({
  name: 'Inter',
  dataThrough: '2026-11-10T03:00:00.000Z',
  freshness: 'fresh',
});
const nubankStale = makeAccount({
  name: 'Nubank',
  dataThrough: '2026-11-02T03:00:00.000Z',
  freshness: 'stale',
});

describe('describeFreshness', () => {
  it('shows the oldest data date and the state of each account', () => {
    expect(describeFreshness([inter, nubankStale], today)).toBe(
      'Dados até 02/11 · Inter em dia · Nubank há 9 dias'
    );
  });

  it('uses the singular for one day', () => {
    const yesterday = makeAccount({
      name: 'Inter',
      dataThrough: '2026-11-10T03:00:00.000Z',
      freshness: 'stale',
    });

    expect(describeFreshness([yesterday], today)).toBe('Dados até 10/11 · Inter há 1 dia');
  });

  it('flags an account that never received a file', () => {
    const empty = makeAccount({ name: 'Nubank' });

    expect(describeFreshness([inter, empty], today)).toBe(
      'Dados até 10/11 · Inter em dia · Nubank sem dados'
    );
  });

  it('ignores inactive accounts', () => {
    const closed = makeAccount({ name: 'Antiga', isActive: false });

    expect(describeFreshness([inter, closed], today)).toBe('Dados até 10/11 · Inter em dia');
  });

  it('asks for the first import when no account has data', () => {
    expect(describeFreshness([makeAccount({ name: 'Inter' })], today)).toBe(
      'Nenhum dado importado ainda · Inter sem dados'
    );
    expect(describeFreshness([], today)).toBe('Nenhuma conta ativa');
  });
});

describe('describeLastImport', () => {
  it('shows the period of the last statement', () => {
    const account = makeAccount({
      lastImportFrom: '2026-10-10T03:00:00.000Z',
      lastImportThrough: '2026-11-14T03:00:00.000Z',
    });

    expect(describeLastImport(account)).toBe('último extrato: 10/10 a 14/11');
  });

  it('shows only the end when the file has no start', () => {
    const account = makeAccount({ lastImportThrough: '2026-11-14T03:00:00.000Z' });

    expect(describeLastImport(account)).toBe('último extrato: até 14/11');
  });

  it('shows the due date when the last file was a bill', () => {
    const account = makeAccount({
      type: 'credit_card',
      lastImportThrough: '2026-11-03T03:00:00.000Z',
      lastImportDueDate: '2026-11-10T03:00:00.000Z',
    });

    expect(describeLastImport(account)).toBe('última fatura: venc. 10/11');
  });

  it('says nothing for an account that never imported', () => {
    expect(describeLastImport(makeAccount({}))).toBeNull();
  });

  it('reads days in São Paulo, not in UTC', () => {
    const account = makeAccount({
      lastImportFrom: '2026-12-20T03:00:00.000Z',
      lastImportThrough: '2027-01-05T02:59:59.000Z',
    });

    expect(describeLastImport(account)).toBe('último extrato: 20/12 a 04/01');
  });
});
