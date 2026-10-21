import { motion } from 'framer-motion';
import { Children, isValidElement, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface StaggeredFadeProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  initialDelay?: number;
  variant?: 'default' | 'wrapper' | 'page' | 'slide-up' | 'slide-down' | 'scale';
  itemClassNames?: (string | undefined)[];
}

const variants = {
  default: {
    containerClass: '',
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
  wrapper: {
    containerClass: 'overflow-hidden',
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  page: {
    containerClass: 'overflow-y-auto min-h-0 p-2 gap-2 grid grid-rows-[1fr]',
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
  'slide-up': {
    containerClass: 'overflow-hidden',
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  'slide-down': {
    containerClass: 'overflow-hidden',
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  scale: {
    containerClass: '',
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
};

export const StaggeredFade = ({
  children,
  className = '',
  staggerDelay = 0.2,
  duration,
  initialDelay = 0.1,
  variant = 'default',
  itemClassNames,
}: StaggeredFadeProps) => {
  const selectedVariant = variants[variant];
  const finalDuration = duration || selectedVariant.transition.duration;
  const containerClassName = `${className} ${selectedVariant.containerClass}`.trim();
  const childArray = Children.toArray(children);

  if (childArray.length === 0) {
    return null;
  }

  return (
    <div className={containerClassName}>
      {childArray.map((child, index) => (
        <motion.div
          key={isValidElement(child) && child.key != null ? child.key : index}
          initial={selectedVariant.initial}
          animate={selectedVariant.animate}
          transition={{
            ...selectedVariant.transition,
            duration: finalDuration,
            delay: initialDelay + index * staggerDelay,
          }}
          className={cn('size-full', itemClassNames?.[index])}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};
