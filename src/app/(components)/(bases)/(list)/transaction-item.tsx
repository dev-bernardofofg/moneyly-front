import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { RecentTransactionItem } from '@/app/(resources)/(generated)';

export const TransactionItem = ({ amount, type, category, date }: RecentTransactionItem) => {
  const isIncome = type === 'income';

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full',
            isIncome
              ? 'bg-linear-to-br from-income/70 to-income'
              : 'bg-linear-to-br from-expense/70 to-expense'
          )}
        >
          {isIncome ? (
            <TrendingUp className="size-5 text-white" />
          ) : (
            <TrendingDown className="size-5 text-white" />
          )}
        </div>
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-medium text-foreground">{category}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      <p
        className={cn(
          'shrink-0 text-sm font-semibold tabular-nums',
          isIncome ? 'text-income' : 'text-expense'
        )}
      >
        {isIncome ? '+' : '-'} {FN_UTILS_NUMBERS.formatCurrency(Math.abs(amount))}
      </p>
    </div>
  );
};
