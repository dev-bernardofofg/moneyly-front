import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggeredFadeProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  initialDelay?: number;
  variant?: "default" | "wrapper" | "page" | "slide-up" | "slide-down" | "scale";
}

const variants = {
  default: {
    containerClass: "",
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  wrapper: {
    containerClass: "overflow-hidden",
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  page: {
    containerClass: "overflow-y-auto max-h-[calc(100vh-5rem)] p-2 space-y-2",
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" }
  },
  "slide-up": {
    containerClass: "overflow-hidden",
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  "slide-down": {
    containerClass: "overflow-hidden",
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  scale: {
    containerClass: "",
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const StaggeredFade = ({
  children,
  className = "",
  staggerDelay = 0.2,
  duration,
  initialDelay = 0.1,
  variant = "default"
}: StaggeredFadeProps) => {
  const selectedVariant = variants[variant];
  const finalDuration = duration || selectedVariant.transition.duration;
  const containerClassName = `${className} ${selectedVariant.containerClass}`.trim();

  return (
    <div className={containerClassName}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div
            key={index}
            initial={selectedVariant.initial}
            animate={selectedVariant.animate}
            transition={{
              ...selectedVariant.transition,
              duration: finalDuration,
              delay: initialDelay + (index * staggerDelay)
            }}
            className="w-full"
          >
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={selectedVariant.initial}
          animate={selectedVariant.animate}
          transition={{
            ...selectedVariant.transition,
            duration: finalDuration,
            delay: initialDelay
          }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}; 