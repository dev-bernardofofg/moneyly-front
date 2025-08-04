import { Goal } from "@/app/(types)/goal.type";
import { Swiper, SwiperSlide } from "swiper/react";
import { GoalCard } from "../(cards)/goal-card";

interface GoalSwiperProps {
  goals?: Goal[];
}

export const GoalSwiper = ({ goals }: GoalSwiperProps) => {
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
        loop={goals.length > 3}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 8,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 8,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 8,
          },
        }}
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