import { describe, expect, it } from 'vitest';
import { AccountSchema } from '@/schemas/account.schema';

describe('AccountSchema', () => {
  it('requires closing and due days for a credit card', () => {
    const result = AccountSchema.safeParse({ name: 'Cartão Inter', type: 'credit_card' });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(['closingDay', 'dueDay']);
  });

  it('accepts a checking account without billing days', () => {
    expect(AccountSchema.safeParse({ name: 'Conta Nubank', type: 'checking' }).success).toBe(true);
  });

  it('accepts a credit card with billing days', () => {
    expect(
      AccountSchema.safeParse({
        name: 'Cartão Inter',
        type: 'credit_card',
        closingDay: 25,
        dueDay: 5,
      }).success
    ).toBe(true);
  });

  it('accepts billing days coming from the select as strings', () => {
    const result = AccountSchema.safeParse({
      name: 'Cartão Inter',
      type: 'credit_card',
      closingDay: '26',
      dueDay: '7',
    });

    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ closingDay: 26, dueDay: 7 });
  });
});
