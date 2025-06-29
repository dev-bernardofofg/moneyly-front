import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StaggeredFadeProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  initialDelay?: number;
}

export const StaggeredFade = ({
  children,
  className = "",
  staggerDelay = 0.2,
  duration = 0.3,
  initialDelay = 0.1
}: StaggeredFadeProps) => {
  return (
    <div className={className}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration,
              ease: "easeOut",
              delay: initialDelay + (index * staggerDelay)
            }}
          >
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration,
            ease: "easeOut",
            delay: initialDelay
          }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}; 