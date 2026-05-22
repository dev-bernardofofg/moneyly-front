'use client';

import { PeriodNavigatorProps } from '@/app/(types)/period.type';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Calendar, TrendingUp } from 'lucide-react';
import { BaseButton } from '../(clickable)/base-button';

export const PeriodNavigator = ({
  periods,
  selectedPeriodId,
  onPeriodSelect,
  loading = false,
}: PeriodNavigatorProps) => {
  if (loading) {
    return (
      <div className="min-w-0 w-full overflow-x-auto p-2">
        <div className="flex gap-2 min-w-max">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-32 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!periods.length) {
    return (
      <div className="w-full p-3 flex items-center justify-center gap-2 text-center rounded-lg bg-muted/30 border border-dashed border-muted-foreground/30">
        <Calendar className="h-4 w-4 text-muted-foreground/50" />
        <p className="text-xs text-muted-foreground">Nenhum período disponível</p>
      </div>
    );
  }

  return (
    <div className="min-w-0 w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max">
        {periods.map((period) => {
          const isSelected = period.id === selectedPeriodId;
          const isCurrent = period.isCurrent;

          return (
            <BaseButton
              key={period.id}
              clickAction="default"
              onClick={() => onPeriodSelect(period.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg border active:scale-95',
                'min-w-[140px] max-w-[200px]',
                isSelected
                  ? 'bg-primary text-primary-foreground border-primary shadow-md'
                  : isCurrent
                    ? 'bg-income/10 text-income border-income/30 hover:bg-income/20'
                    : 'bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-muted-foreground/30 dark:bg-muted/90 dark:text-muted-foreground/50 dark:border-muted-foreground/30 dark:hover:bg-muted/90 dark:hover:border-muted-foreground/30'
              )}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {isCurrent ? (
                  <TrendingUp className="h-3.5 w-3.5 text-income flex-shrink-0" />
                ) : (
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                )}
                <span className="text-xs font-medium truncate">{period.label}</span>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  'text-xs px-1.5 py-0.5 h-5 min-w-5',
                  isSelected
                    ? 'bg-primary-foreground/20 text-primary-foreground'
                    : isCurrent
                      ? 'bg-income/15 text-income'
                      : 'bg-muted-foreground/20 text-muted-foreground dark:bg-muted-foreground/90 dark:text-muted-foreground/50 dark:border-muted-foreground/30 dark:hover:bg-muted-foreground/90 dark:hover:border-muted-foreground/30'
                )}
              >
                {period.transactionCount}
              </Badge>
            </BaseButton>
          );
        })}
      </div>
    </div>
  );
};
