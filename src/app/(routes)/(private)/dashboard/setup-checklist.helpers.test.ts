import type { Account } from '@/api/generated/types/Account';
import type { RecurringTransaction } from '@/api/generated/types/RecurringTransaction';
import { describe, expect, it } from 'vitest';
import { pendingSetupSteps } from './setup-checklist.helpers';

const account = (extra: Partial<Account>) =>
  ({
    id: Math.random().toString(),
    type: 'checking',
    openingBalanceDate: null,
    creditLimit: null,
    ...extra,
  }) as Account;
const recurrence = (extra: Partial<RecurringTransaction>) =>
  ({ isActive: true, type: 'expense', accountId: null, ...extra }) as RecurringTransaction;

describe('pendingSetupSteps', () => {
  it('asks for the opening balance and a card when there is only a bare checking account', () => {
    expect(pendingSetupSteps([account({})], [recurrence({})]).map((step) => step.key)).toEqual([
      'salary',
      'opening-balance',
      'card',
    ]);
  });

  it('asks for the card limit and the card of default-account recurrences', () => {
    const steps = pendingSetupSteps(
      [
        account({ openingBalanceDate: '2026-09-01T03:00:00.000Z' }),
        account({ type: 'credit_card' }),
      ],
      [recurrence({}), recurrence({ type: 'income' }), recurrence({ accountId: 'card' })]
    );

    expect(steps.map((step) => step.key)).toEqual(['credit-limit', 'recurring-card']);
    expect(steps.map((step) => step.key)).not.toContain('salary');
    expect(steps[1]!.text).toContain('1 recorrência');
  });

  it('has nothing to ask once everything is set', () => {
    expect(
      pendingSetupSteps(
        [
          account({ openingBalanceDate: '2026-09-01T03:00:00.000Z' }),
          account({ type: 'credit_card', creditLimit: 500000 }),
        ],
        [recurrence({ accountId: 'card' }), recurrence({ type: 'income' })]
      )
    ).toEqual([]);
  });
});
