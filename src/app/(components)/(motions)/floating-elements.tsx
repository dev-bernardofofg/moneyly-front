import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"

interface FloatingElementsProps {
  className?: string
  Icon?: LucideIcon
  size?: "sm" | "md" | "lg"
  animation?: "float" | "pulse" | "bounce" | "spin"
}

export const FloatingElements = ({
  className,
  Icon,
  size = "md",
  animation = "float"
}: FloatingElementsProps) => {
  const sizeClasses = {
    sm: "size-20",
    md: "size-32",
    lg: "size-40"
  }

  const animationVariants = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    bounce: {
      y: [0, -15, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    spin: {
      rotate: [0, 360],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        ...animationVariants[animation]
      }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        delay: Math.random() * 0.5
      }}
      className={cn(
        "absolute rounded-full flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <div className="absolute inset-0 rounded-full blur-2xl bg-primary/30" />

      {Icon && (
        <Icon className="relative z-10 size-6 text-primary/60 animate-pulse" />
      )}
    </motion.div>
  );
}
