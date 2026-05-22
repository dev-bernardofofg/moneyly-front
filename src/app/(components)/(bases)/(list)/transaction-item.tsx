import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import { cn } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { RecentTransactionItem } from '@/app/(resources)/(generated)';

export const TransactionItem = ({ amount, type, category, date }: RecentTransactionItem) => {
  const gradientByTypeTransaction = (type: string) => {
    if (type === 'income') {
      return 'bg-gradient-to-r from-income/70 to-income';
    }
    return 'bg-gradient-to-r from-expense/70 to-expense';
  };
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'size-10 flex items-center justify-center rounded-full',
            gradientByTypeTransaction(type)
          )}
        >
          {type === 'income' ? (
            <TrendingUp className="size-5 text-white" />
          ) : (
            <TrendingDown className="size-5 text-white" />
          )}
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-foreground">{category}</p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <p
          className={cn('text-sm font-medium', type === 'income' ? 'text-income' : 'text-expense')}
        >
          {FN_UTILS_NUMBERS.formatCurrency(amount)}
        </p>
      </div>
    </div>
  );
};
