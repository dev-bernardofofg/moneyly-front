"use client"

import { Alert, AlertsPopover } from '@/app/(components)/(bases)/(notifications)/alerts-popover'
import { BaseStats } from '@/app/(components)/(bases)/(stats)/base-stats'
import { StaggeredFade } from '@/app/(components)/(motions)/staggered-fade'
import { Bell, PieChart, Target, TrendingUp } from 'lucide-react'

interface PlannerStatsProps {
  totalBudgeted?: number
  savingsGoal?: number
  alreadySaved?: number
  alerts?: Alert[]
}

export const PlannerStats = ({
  totalBudgeted = 0,
  savingsGoal = 0,
  alreadySaved = 0,
  alerts = []
}: PlannerStatsProps) => {
  return (
    <StaggeredFade className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2'>
      <BaseStats
        name="Total Orçado"
        Icon={PieChart}
        value={totalBudgeted}
        isMonetary
        variant="secondary"
        loading={false}
      />
      <BaseStats
        name="Meta de Poupança"
        Icon={Target}
        value={savingsGoal}
        isMonetary
        variant="secondary"
        loading={false}
      />
      <BaseStats
        name="Já Poupado"
        Icon={TrendingUp}
        value={alreadySaved}
        isMonetary
        loading={false}
      />
      <AlertsPopover
        alerts={alerts}
        trigger={
          <BaseStats
            name="Alertas"
            Icon={Bell}
            value={alerts.length}
            variant="secondary"
            loading={false}
            clickable={true}
          />
        }
      />
    </StaggeredFade>
  )
} 