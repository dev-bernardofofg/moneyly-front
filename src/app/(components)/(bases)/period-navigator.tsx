"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Calendar, TrendingUp } from "lucide-react";
import { BaseButton } from "./base-button";

export const PeriodNavigator = ({
  periods,
  selectedPeriodId,
  onPeriodSelect,
  loading = false,
}: PeriodNavigatorProps) => {
  if (loading) {
    return (
      <div className="w-full overflow-x-auto p-2">
        <div className="flex gap-2 min-w-max p-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-32 rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!periods.length) {
    return null;
  }

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 min-w-max p-1">
        {periods.map((period) => {
          const isSelected = period.id === selectedPeriodId;
          const isCurrent = period.isCurrent;

          return (
            <BaseButton
              key={period.id}
              clickAction="default"
              onClick={() => onPeriodSelect(period.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95",
                "min-w-[140px] max-w-[200px]",
                // Estados visuais
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-md"
                  : isCurrent
                    ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:border-muted-foreground/30"
              )}
            >
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                {isCurrent ? (
                  <TrendingUp className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                ) : (
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                )}
                <span className="text-xs font-medium truncate">
                  {period.label}
                </span>
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs px-1.5 py-0.5 h-5 min-w-[20px]",
                  isSelected
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : isCurrent
                      ? "bg-green-100 text-green-700"
                      : "bg-muted-foreground/20 text-muted-foreground"
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