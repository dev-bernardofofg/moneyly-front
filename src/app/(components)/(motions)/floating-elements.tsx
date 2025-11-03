import { cn } from "@/lib/utils"
import { motion, type Variants } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface FloatingElementsProps {
  className?: string
  Icon?: LucideIcon
  size?: "sm" | "md" | "lg"
  animation?: "float" | "pulse" | "bounce" | "spin"
  opacity?: "subtle" | "medium" | "strong"
  delay?: number
}

const sizeClasses = {
  sm: "size-16 sm:size-20",
  md: "size-24 sm:size-32",
  lg: "size-32 sm:size-40"
}

const iconSizeClasses = {
  sm: "size-4 sm:size-5",
  md: "size-5 sm:size-6",
  lg: "size-6 sm:size-7"
}

const opacityClasses = {
  subtle: "opacity-20",
  medium: "opacity-40",
  strong: "opacity-60"
}

const animationVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
  float: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  pulse: {
    scale: [1, 1.1, 1],
    opacity: [0.4, 0.6, 0.4],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  bounce: {
    y: [0, -15, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  spin: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
}

export const FloatingElements = ({
  className,
  Icon,
  size = "md",
  animation = "float",
  opacity = "medium",
  delay = 0
}: FloatingElementsProps) => {
  return (
    <motion.div
      initial="hidden"
      animate={["visible", animation]}
      variants={animationVariants}
      transition={{ delay }}
      className={cn(
        "absolute rounded-full flex items-center justify-center pointer-events-none",
        sizeClasses[size],
        className
      )}
    >
      {/* Gradiente com blur para efeito mais suave */}
      <div className={cn(
        "absolute inset-0 rounded-full blur-xl",
        "bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10",
        opacityClasses[opacity]
      )} />
      
      {/* Anel externo sutil */}
      <div className={cn(
        "absolute inset-0 rounded-full border-2",
        "border-primary/10 dark:border-primary/20",
        opacityClasses[opacity]
      )} />

      {Icon && (
        <motion.div
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative z-10"
        >
          <Icon className={cn(
            "text-primary/60 dark:text-primary/70",
            iconSizeClasses[size]
          )} />
        </motion.div>
      )}
    </motion.div>
  );
}
