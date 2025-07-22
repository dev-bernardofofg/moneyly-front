"use client"

import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface SectionProps {
  Icon: LucideIcon
  title: string
  children: React.ReactNode
}

export const Section = ({
  Icon,
  title,
  children
}: SectionProps) => {
  return (
    <StaggeredFade className='bg-slate-100 dark:bg-slate-800 rounded-lg dark:border-slate-700 border border-slate-200'>
      <Card className='w-full border-none'>
        <CardHeader className='border-b border-slate-200 dark:border-slate-700'>
          <CardTitle className='flex items-center gap-2'>
            <Icon className='size-5 text-primary' />
            <span className='text-lg font-bold'>{title}</span>
          </CardTitle>
        </CardHeader>

        <CardContent className='p-6'>
          {children}
        </CardContent>
      </Card>
    </StaggeredFade>
  )
} 