import { Goal } from "@/app/(resources)/(generated)";
import { Skeleton } from "@/components/ui/skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { GoalCard } from "../(cards)/goal-card";

interface GoalSwiperProps {
  goals?: Goal[];
  loading?: boolean;
}

export const GoalSwiper = ({ goals, loading }: GoalSwiperProps) => {
  if (loading) {
    return (
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="min-w-[220px] rounded-lg p-4 border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 space-y-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Nenhuma meta encontrada</p>
      </div>
    )
  }

  return (
    <div className="budget-swiper-container">
      <Swiper
        spaceBetween={8}
        slidesPerView="auto"
        className="budget-swiper"
      >
        {goals.map((goal) => (
          <SwiperSlide key={goal.id}>
            <GoalCard goal={goal} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}