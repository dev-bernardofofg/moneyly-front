'use client';

import type { CardBills } from '@/api/generated/types/CardBills';
import { Section } from '@/components/cards/section';
import { Skeleton } from '@/components/ui/skeleton';
import { useAccounts } from '@/hooks/use-accounts';
import { FN_UTILS_NUMBERS } from '@/lib/number';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { CreditCard, Landmark, Wallet } from 'lucide-react';
import Link from 'next/link';

const money = FN_UTILS_NUMBERS.formatCurrency;

/** Onde está o dinheiro agora: saldo de cada conta e quanto cada cartão ainda tem de limite. */
export const AccountsOverviewSection = ({ cardBills }: { cardBills?: CardBills }) => {
  const { accounts, isLoading } = useAccounts();
  const checking = accounts.filter((account) => account.type === 'checking');
  const cards = accounts.filter((account) => account.type === 'credit_card');
  const known = checking.filter((account) => account.currentBalance != null);
  const total = known.reduce((sum, account) => sum + (account.currentBalance ?? 0), 0);
  const limitOf = (accountId: string) =>
    cardBills?.bills.find((bill) => bill.accountId === accountId)?.limit ?? null;

  return (
    <Section Icon={Wallet} title="Suas contas">
      {isLoading ? (
        <div className="space-y-2" aria-label="Carregando contas">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">Saldo em contas</p>
          <p
            className={cn(
              'mb-4 text-2xl font-bold tabular-nums',
              total < 0 ? 'text-expense' : 'text-income'
            )}
          >
            {known.length ? money(total) : '—'}
          </p>
          <ul className="divide-y" aria-label="Contas e cartões">
            {checking.map((account) => (
              <li key={account.id} className="flex items-center gap-3 py-2 text-sm">
                <Landmark className="size-4 shrink-0 text-primary-strong" aria-hidden />
                <span className="min-w-0 flex-1 truncate">{account.name}</span>
                {account.currentBalance != null ? (
                  <span
                    className={cn(
                      'font-semibold tabular-nums',
                      account.currentBalance < 0 && 'text-expense'
                    )}
                  >
                    {money(account.currentBalance)}
                  </span>
                ) : (
                  <Link
                    href={ROUTES.ACCOUNTS}
                    className="text-xs font-medium text-primary-strong underline-offset-2 hover:underline"
                  >
                    Informar saldo
                  </Link>
                )}
              </li>
            ))}
            {cards.map((card) => {
              const limit = limitOf(card.id);
              return (
                <li key={card.id} className="flex items-center gap-3 py-2 text-sm">
                  <CreditCard className="size-4 shrink-0 text-primary-strong" aria-hidden />
                  <span className="min-w-0 flex-1 truncate">{card.name}</span>
                  {limit ? (
                    <span className="text-right tabular-nums">
                      <span className="font-semibold">{money(limit.available)}</span>
                      <span className="block text-xs text-muted-foreground">disponível</span>
                    </span>
                  ) : (
                    <Link
                      href={ROUTES.ACCOUNTS}
                      className="text-xs font-medium text-primary-strong underline-offset-2 hover:underline"
                    >
                      Informar limite
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
          {known.length > 0 && known.length < checking.length && (
            <p className="mt-2 text-xs text-muted-foreground">
              O total soma só as contas com saldo inicial informado.
            </p>
          )}
        </>
      )}
    </Section>
  );
};
