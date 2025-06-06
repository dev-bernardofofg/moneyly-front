import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, mergeRefs } from "@/lib/utils";
import { motion } from "framer-motion";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { forwardRef, ReactNode, useRef, useState } from "react";
import { Control, FieldValues, Path } from "react-hook-form";

export interface IBaseInput<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  Icon?: React.ComponentType<{ className?: string }>;
  type?: string;
  description?: string | ReactNode;
  readOnly?: boolean;
  showError?: boolean;
  className?: string;
  rightElement?: ReactNode;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export const BaseInput = forwardRef<HTMLInputElement, IBaseInput<any>>(
  (
    {
      control,
      name,
      label = "",
      placeholder,
      Icon,
      description = "",
      type = "text",
      readOnly = false,
      showError = true,
      className = "",
      rightElement,
      isLoading,
      autoFocus,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
      <FormField
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          return (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <FormItem>
                {label && (
                  <div className="flex justify-between">
                    <FormLabel>{label}</FormLabel>
                    {fieldState.error && showError && (
                      <FormLabel>{fieldState.error.message}</FormLabel>
                    )}
                  </div>
                )}
                <FormControl>
                  {isLoading ? (
                    <div className="w-full h-10 flex items-center justify-center bg-background rounded border border-border">
                      <LoaderCircle className="animate-spin size-5 opacity-40" />
                    </div>
                  ) : (
                    <motion.div
                      className={cn(
                        "relative group rounded-md border bg-input focus-within:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:outline-none",
                        Icon && "pl-6",
                        (isPassword || readOnly) && "pr-10",
                        rightElement && "pr-24",
                        className
                      )}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                    >
                      <Input
                        tabIndex={0}
                        placeholder={placeholder}
                        {...field}
                        value={field?.value || ""}
                        ref={mergeRefs(ref, field.ref, inputRef)}
                        type={inputType}
                        readOnly={readOnly}
                        autoFocus={autoFocus}
                        className="h-10 w-full bg-transparent border-none outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus-within:ring-0 focus:border-none focus-within:border-none focus-visible:border-none active:border-none active:ring-0 active:outline-none focus:outline-none focus-visible:outline-none px-3 py-2 text-base placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        {...rest}
                      />
                      {Icon && (
                        <FormLabel>
                          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-input-hover" />
                        </FormLabel>
                      )}
                      {isPassword && (
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-600 group-focus-within:text-input-hover"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </button>
                      )}
                      {rightElement && (
                        <div className="absolute right-0 top-0 h-full">
                          {rightElement}
                        </div>
                      )}
                    </motion.div>
                  )}
                </FormControl>
                {description && (
                  <FormDescription>{description}</FormDescription>
                )}
              </FormItem>
            </motion.div>
          );
        }}
      />
    );
  }
);

BaseInput.displayName = "BaseInput";
