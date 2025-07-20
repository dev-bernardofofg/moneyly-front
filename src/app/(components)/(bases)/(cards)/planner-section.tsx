"use client"

import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Target } from 'lucide-react'

interface PlannerSectionProps {
  title: string
  children: React.ReactNode
}

export const PlannerSection = ({
  title,
  children
}: PlannerSectionProps) => {
  return (
    <StaggeredFade className='bg-slate-100 dark:bg-slate-800 rounded-lg dark:border-slate-700 border border-slate-200'>
      <Card className='w-full border-none'>
        <CardHeader className='border-b border-slate-200 dark:border-slate-700'>
          <CardTitle className='flex items-center gap-2'>
            <Target className='size-5 text-primary' />
            <h1 className='text-lg font-bold'>{title}</h1>
          </CardTitle>
        </CardHeader>

        <CardContent className='p-6'>
          {children}
        </CardContent>
      </Card>
    </StaggeredFade>
  )
} 