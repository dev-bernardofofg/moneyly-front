"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Control, FieldValues, Path, useFormContext } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type BaseTextareaProps<T extends FieldValues> = {
  control?: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  description?: string;
  Icon?: LucideIcon;
  minHeight?: string;
};

export function BaseTextarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  minHeight = "100px",
}: BaseTextareaProps<T>) {
  const methods = useFormContext<T>();
  const finalControl = control || methods.control;

  return (
    <FormField
      control={finalControl}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="relative w-full">
          {label && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between"
            >
              {fieldState.error ? (
                <FormLabel className="text-destructive" >{fieldState.error.message}</FormLabel>
              ) : <FormLabel>{label}</FormLabel>}
            </motion.div>
          )}

          <FormControl>
            <Textarea
              {...field}
              style={{ minHeight }}
              placeholder={placeholder}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
        </FormItem>
      )}
    />
  );
}