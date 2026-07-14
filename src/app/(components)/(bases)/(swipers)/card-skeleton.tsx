import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const CardSkeleton = () => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 size-full">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="min-w-[220px] size-full flex flex-col justify-between rounded-lg p-4 border border-slate-200 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-10 w-16 rounded" />
          </div>
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-4 w-full rounded-full" />
          <div className="flex gap-2 pt-1">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
