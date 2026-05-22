import { Goal } from '@/app/(resources)/(generated)';
import { Skeleton } from '@/components/ui/skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { GoalCard } from '../(cards)/goal-card';
import { CardSkeleton } from './card-skeleton';

interface GoalSwiperProps {
  goals?: Goal[];
  loading?: boolean;
}

export const GoalSwiper = ({ goals, loading }: GoalSwiperProps) => {
  if (loading) {
    return <CardSkeleton />;
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-sm text-muted-foreground">Nenhuma meta encontrada</p>
      </div>
    );
  }

  return (
    <div className="budget-swiper-container">
      <Swiper spaceBetween={8} slidesPerView="auto" className="budget-swiper">
        {goals.map((goal) => (
          <SwiperSlide key={goal.id}>
            <GoalCard goal={goal} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
