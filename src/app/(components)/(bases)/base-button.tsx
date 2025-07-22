"use client";

import { Loader2, Plus } from "lucide-react";
import { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BaseButtonProps extends ComponentProps<typeof Button> {
  isLoading?: boolean;
  loadingText?: string;
  clickAction?: "default" | "sign-out" | "create"
}

export const BaseButton = ({
  children,
  isLoading,
  loadingText,
  className,
  disabled,
  clickAction = "default",
  ...props
}: BaseButtonProps) => {
  return (
    <Button
      className={cn("w-full space-x-3 hover:cursor-pointer", className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {clickAction === "create" && <Plus className="mr-1 size-4 text-black" />}

          {children}
        </>
      )}
    </Button>
  );
};
