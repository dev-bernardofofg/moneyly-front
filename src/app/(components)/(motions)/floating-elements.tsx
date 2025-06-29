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

  return (
    <motion.div
      initial="hidden"
      animate={["visible", animation]}
      className={cn(
        "absolute rounded-full flex items-center justify-center",
        sizeClasses[size],
        className
      )}
    >
      <div className="absolute inset-0 rounded-full blur-2xl bg-primary/70" />

      {Icon && (
        <Icon className="relative z-10 size-6 text-primary/70 animate-pulse" />
      )}
    </motion.div>
  );
}
