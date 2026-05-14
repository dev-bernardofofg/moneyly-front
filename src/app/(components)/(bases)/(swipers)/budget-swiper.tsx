"use client"

import { BudgetCard } from '@/app/(components)/(bases)/(cards)/budget-card'
import { Budget } from '@/app/(resources)/(generated)'
import { Skeleton } from '@/components/ui/skeleton'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'

interface BudgetSwiperProps {
  budgets?: Budget[]
  loading?: boolean
}

export const BudgetSwiper = ({ budgets, loading }: BudgetSwiperProps) => {
  if (loading) {
    return (
      <div className='flex gap-2 overflow-hidden'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='min-w-[220px] rounded-lg p-4 border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-700 space-y-3'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Skeleton className='size-5 rounded-full' />
                <Skeleton className='h-4 w-24' />
              </div>
              <Skeleton className='h-5 w-16 rounded' />
            </div>
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-3 w-full' />
            <Skeleton className='h-2 w-full rounded-full' />
            <div className='flex gap-2 pt-1'>
              <Skeleton className='h-8 w-full' />
              <Skeleton className='h-8 w-full' />
            </div>
          </div>
        ))}
      </div>
    )
  }

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