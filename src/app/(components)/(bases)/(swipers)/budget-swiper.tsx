'use client';

import { BudgetCard } from '@/app/(components)/(bases)/(cards)/budget-card';
import { BudgetProgress } from '@/app/(resources)/(generated)';
import { Skeleton } from '@/components/ui/skeleton';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { CardSkeleton } from './card-skeleton';

interface BudgetSwiperProps {
  budgets?: BudgetProgress[];
  loading?: boolean;
}

export const BudgetSwiper = ({ budgets, loading }: BudgetSwiperProps) => {
  if (loading) {
    return <CardSkeleton />;
  }

  if (!budgets || budgets.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Nenhum orçamento encontrado</p>
      </div>
    );
  }

  return (
    <div className="budget-swiper-container">
      <Swiper
        spaceBetween={8}
        slidesPerView="auto"
        freeMode={{
          enabled: true,
          sticky: false,
          momentumBounce: false,
        }}
        grabCursor={true}
        className="budget-swiper"
      >
        {budgets.map((budget) => (
          <SwiperSlide key={budget.id}>
            <BudgetCard budget={budget} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
