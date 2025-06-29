import { cn } from '@/lib/utils'
import { DollarSign } from 'lucide-react'
import Link from 'next/link'

interface LogoProps {
  className?: string
  fullName?: boolean
  href?: boolean
  animate?: boolean
}

export const Logo = ({ className, fullName = false, href = false, animate = true }: LogoProps) => {
  return (
    <div className={cn("flex items-center justify-center gap-2", className)}>
      {href ? (
        <Link href="/dashboard" className=" flex items-center justify-center gap-2">
          <div className={cn("size-12 bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/25", animate && "animate-float")}>
            <DollarSign className="size-6 text-white dark:text-slate-950" />
          </div>
          {fullName && <span className="text-lg font-bold text-slate-950 dark:text-white">Moneyly</span>}
        </Link>
      ) : (
        <div className="relative w-20 h-20 flex items-center justify-center gap-2">
          <div className="size-12 bg-linear-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center shadow-lg shadow-primary/25 animate-float">
            <DollarSign className="size-6 text-white dark:text-slate-950" />
          </div>
          {fullName && <span className="text-lg font-bold text-slate-950 dark:text-white">Moneyly</span>}
        </div>
      )}
    </div>
  )
}
