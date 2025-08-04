"use client"

import { BudgetCard } from '@/app/(components)/(bases)/(cards)/budget-card'
import { Budget } from '@/app/(types)/budget.type'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

interface BudgetSwiperProps {
  budgets?: Budget[]
}

export const BudgetSwiper = ({ budgets }: BudgetSwiperProps) => {
  if (!budgets || budgets.length === 0) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-sm text-muted-foreground'>Nenhum orçamento encontrado</p>
      </div>
    )
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
        loop={budgets.length > 3}
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
        {budgets.map((budget) => (
          <SwiperSlide key={budget.id}>
            <BudgetCard budget={budget} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
} 