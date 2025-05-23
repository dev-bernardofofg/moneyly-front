import React, { forwardRef, ReactNode, useState, useRef } from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn, IconType, mergeRefs } from "@/lib/utils";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";

export interface IBaseInput<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  Icon?: IconType;
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
    ref,
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
                  <div className="w-full h-10 flex items-center justify-center bg-background  rounded border border-border">
                    <LoaderCircle className="animate-spin size-5 opacity-40" />
                  </div>
                ) : (
                  <div className="relative group">
                    <Input
                      tabIndex={0}
                      placeholder={placeholder}
                      {...field}
                      value={field?.value || ""}
                      ref={mergeRefs(ref, field.ref, inputRef)}
                      type={inputType}
                      className={cn(
                        " placeholder-muted-foreground",
                        (isPassword || readOnly) && "pr-10",
                        className,
                        Icon && "pl-10",
                        rightElement && "pr-24",
                      )}
                      readOnly={readOnly}
                      autoFocus={autoFocus}
                      {...rest}
                    />
                    {Icon && (
                      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-input-hover" />
                    )}

                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-gray-600 group-focus-within:text-input-hover"
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
                  </div>
                )}
              </FormControl>
              {description && <FormDescription>{description}</FormDescription>}
            </FormItem>
          );
        }}
      />
    );
  },
);

BaseInput.displayName = "BaseInput";
