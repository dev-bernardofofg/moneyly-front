"use client";

import { MobileActionsMenu } from "@/app/(components)/(bases)/mobile-actions-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderProps {
  actions?: React.ReactNode
  title: string
}

export const Header = ({ actions, title }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <header className="h-20 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
      <div className="flex items-center justify-between gap-3 px-4 h-full">

        {isMobile && (
          <SidebarTrigger />
        )}
        <div className="flex items-center gap-3 w-full">
          <h1 className="text-lg font-bold text-slate-950 dark:text-white">{title}</h1>
        </div>
        {actions && (
          <>
            {isMobile ? (
              <MobileActionsMenu actions={actions} />
            ) : (
              <div className="flex items-center gap-3 w-fit">
                {actions}
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};
