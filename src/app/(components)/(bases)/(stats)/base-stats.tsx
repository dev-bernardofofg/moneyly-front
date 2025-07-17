import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number'
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cva } from 'class-variance-authority'
import { AnimatePresence, motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface BaseStatsProps {
  name: string
  value: number
  Icon: LucideIcon
  description: string
  isMonetary?: boolean
  variant?: "default" | "secondary" | "destructive"
  loading?: boolean
}

export const BaseStats = ({ name, value, Icon, description, isMonetary = false, variant = "default", loading = false }: BaseStatsProps) => {
  const variantsStats = cva(
    "rounded-lg bg-slate-50 dark:bg-slate-800 dark:border-slate-700 border border-slate-200", {
    variants: {
      variant: {
        default: "dark:text-white text-card-foreground shadow-xs backdrop-blur-xs duration-300 transition-colors",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "dark:text-white text-card-foreground shadow-xs backdrop-blur-xs duration-300 transition-colors",
      },
    }
  })

  const variantsText = cva("text-2xl font-bold", {
    variants: {
      variant: {
        default: "text-green-600",
        secondary: "text-blue-600",
        destructive: "text-red-600",
      },
    }
  })

  const variantsIcon = cva("size-4", {
    variants: {
      variant: {
        default: "text-green-600",
        secondary: "text-blue-600",
        destructive: "text-red-600",
      },
    }
  })

  return (
    <div className={variantsStats({ variant })}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <Icon className={variantsIcon({ variant })} />
      </CardHeader>
      <CardContent>
        <div className={`${variantsText({ variant })} min-h-[1.5rem] flex items-center`}>
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <Skeleton className="w-12 h-6 bg-slate-200 dark:bg-slate-700" />
              </motion.div>
            ) : (
              <motion.span
                key="value"
                initial={{ opacity: 0, y: 5, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -5, scale: 0.98 }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut"
                }}
              >
                {isMonetary ? FN_UTILS_NUMBERS.formatCurrencyToNumber(value) : value}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </div>
  )
}
