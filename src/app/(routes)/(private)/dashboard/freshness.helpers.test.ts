import type { Account } from '@/api/generated/types/Account';
import { describe, expect, it } from 'vitest';
import { describeFreshness } from './freshness.helpers';

const today = new Date('2026-11-11T15:00:00.000Z');

const makeAccount = (overrides: Partial<Account>): Account =>
  ({
    id: overrides.name ?? 'account',
    name: 'Conta',
    type: 'checking',
    isActive: true,
    dataThrough: null,
    freshness: 'empty',
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
