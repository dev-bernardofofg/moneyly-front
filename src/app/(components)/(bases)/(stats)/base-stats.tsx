import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { AnimatePresence, motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BaseStatsProps {
  name: string;
  value: number | string;
  Icon: LucideIcon;
  description?: string | React.ReactNode;
  isMonetary?: boolean;
  variant?: 'default' | 'secondary' | 'destructive';
  loading?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}

const variantsStats = cva(
  'rounded-lg bg-white/95 dark:bg-slate-800 dark:border-slate-700 border border-slate-200 h-full transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'dark:text-white text-card-foreground shadow-xs backdrop-blur-xs',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'dark:text-white text-card-foreground shadow-xs backdrop-blur-xs',
      },
    },
  }
);

const variantsText = cva('text-2xl font-bold tabular-nums leading-none', {
  variants: {
    variant: {
      default: 'text-income',
      secondary: 'text-info',
      destructive: 'text-expense',
    },
  },
});

const variantsIconWrap = cva('flex size-9 shrink-0 items-center justify-center rounded-lg', {
  variants: {
    variant: {
      default: 'bg-income/10 text-income',
      secondary: 'bg-info/10 text-info',
      destructive: 'bg-expense/10 text-expense',
    },
  },
});

export const BaseStats = ({
  name,
  value,
  Icon,
  description,
  isMonetary = false,
  variant = 'default',
  loading = false,
  children,
  onClick,
  clickable = false,
}: BaseStatsProps) => {
  const clickableClasses = clickable
    ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'
    : '';

  return (
    <div
      className={cn(variantsStats({ variant }), clickableClasses)}
      onClick={clickable ? onClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{name}</CardTitle>
        <span className={variantsIconWrap({ variant })}>
          <Icon className="size-4" />
        </span>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <div className={cn(variantsText({ variant }), 'flex min-h-7 items-center')}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <Skeleton className="h-7 w-20 bg-slate-200 dark:bg-slate-700" />
              </motion.div>
            ) : (
              <motion.span
                key="value"
                initial={{ opacity: 0, y: 5, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.98 }}
                className={cn('min-w-0 truncate', !isMonetary && 'capitalize')}
                transition={{
                  duration: 0.25,
                  ease: 'easeOut',
                }}
              >
                {isMonetary ? FN_UTILS_NUMBERS.formatCurrency(value) : value}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {description && (
          <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
      {children}
    </div>
  );
};
