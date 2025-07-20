"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface FadeProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  className?: string;
}

export const Fade = ({
  children,
  duration = 0.3,
  delay = 0,
  direction,
  distance = 50,
  className,
}: FadeProps) => {
  const getDirectionalAnimation = () => {
    if (!direction) return {};

    const directionMap = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
    };

    return directionMap[direction];
  };

  return (
    <motion.main
      initial={{
        opacity: 0,
        ...getDirectionalAnimation(),
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      exit={{
        opacity: 0,
        ...getDirectionalAnimation(),
      }}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
      className={cn(className, "w-full h-screen bg-white dark:bg-slate-900 max-w-[calc(100vw-16rem)]")}
    >
      {children}
    </motion.main >
  );
};
