"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Children, isValidElement, ReactNode } from "react";

interface MobileActionsMenuProps {
  actions: ReactNode;
}

// Função para converter actions em DropdownMenuItems
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
        <button className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {renderActionsInDropdown(actions)}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}; 