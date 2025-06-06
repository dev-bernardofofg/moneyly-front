import { motion, MotionProps } from "framer-motion";
import { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type BaseFormProps = ComponentPropsWithoutRef<"form"> & MotionProps;

export const BaseForm = ({ children, className, ...props }: BaseFormProps) => {
  return (
    <motion.form
      className={cn("space-y-4 p-8 bg-secondary rounded-lg shadow", className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.form>
  );
};
