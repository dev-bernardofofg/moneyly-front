"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ArrowDownCircleIcon } from "lucide-react";
import { Children, isValidElement, ReactNode } from "react";

interface MobileActionsMenuProps {
  actions: ReactNode;
}

const renderActionsInDropdown = (actions: ReactNode): ReactNode => {
  if (!actions) return null;

  if (Array.isArray(actions)) {
    return Children.map(actions, (child, index) => {
      if (isValidElement(child)) {
        return (
          <DropdownMenuItem key={index} asChild>
            {child}
          </DropdownMenuItem>
        );
      }
      return child;
    });
  }

  if (isValidElement(actions)) {
    return (
      <DropdownMenuItem asChild>
        {actions}
      </DropdownMenuItem>
    );
  }

  return actions;
};

export const MobileActionsMenu = ({ actions }: MobileActionsMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ArrowDownCircleIcon className="size-6 text-slate-950 dark:text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto max-w-56 space-y-1">
        {renderActionsInDropdown(actions)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 