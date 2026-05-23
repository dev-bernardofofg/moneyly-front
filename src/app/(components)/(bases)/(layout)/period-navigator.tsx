'use client';

import { PeriodNavigatorProps } from '@/app/(types)/period.type';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const PeriodNavigator = ({
  periods,
  selectedPeriodId,
  onPeriodSelect,
  loading = false,
}: PeriodNavigatorProps) => {
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-md" />
        <Skeleton className="h-9 w-48 rounded-md" />
        <Skeleton className="h-9 w-9 rounded-md" />
      </div>
    );
  }

  if (!periods.length) {
    return (
      <div className="flex h-9 items-center rounded-md border border-dashed border-muted-foreground/30 bg-muted/30 px-3">
        <span className="text-xs text-muted-foreground">Nenhum período disponível</span>
      </div>
    );
  }

  const chronological = [...periods].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  const currentIndex = chronological.findIndex((p) => p.id === selectedPeriodId);
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < chronological.length - 1;

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        disabled={!canGoPrev}
        onClick={() => onPeriodSelect(chronological[currentIndex - 1].id)}
        aria-label="Período anterior"
      >
        <ChevronLeft className="size-4" />
      </Button>

      <Select value={selectedPeriodId} onValueChange={onPeriodSelect}>
        <SelectTrigger className="w-52">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periods.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              <div className="flex items-center gap-2">
                <span>{p.label}</span>
                {p.isCurrent && <Badge className="h-4 px-1.5 text-[10px]">Atual</Badge>}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        disabled={!canGoNext}
        onClick={() => onPeriodSelect(chronological[currentIndex + 1].id)}
        aria-label="Próximo período"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};
