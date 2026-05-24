'use client';

import { FabAction, FabSpeedDial } from '@/app/(components)/(bases)/(layout)/fab-speed-dial';
import { NotificationBell } from '@/app/(components)/(bases)/(notifications)/notification-bell';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  title: string;
  actions?: React.ReactNode[];
  mobileHeaderActions?: React.ReactNode[];
  fabActions?: FabAction[];
}

export const Header = ({ title, actions, mobileHeaderActions, fabActions }: HeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <>
      <header className="h-14 md:h-16 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-3 px-4 h-full">
          {!isMobile && <SidebarTrigger />}
          <div className="flex items-center gap-3 w-full">
            <h1 className="base:text-base md:text-lg font-bold text-slate-950 dark:text-white">
              {title}
            </h1>
          </div>
          <div className="flex items-center gap-3 w-fit">
            <NotificationBell />
            {isMobile
              ? mobileHeaderActions?.map((action, i) => <div key={i}>{action}</div>)
              : actions?.map((action, i) => <div key={i}>{action}</div>)}
          </div>
        </div>
      </header>
      {isMobile && fabActions && <FabSpeedDial actions={fabActions} />}
    </>
  );
};
