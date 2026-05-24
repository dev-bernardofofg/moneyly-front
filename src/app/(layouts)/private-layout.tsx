'use client';

import { SidebarProvider } from '@/components/ui/sidebar';
import { BottomNav } from '../(components)/(layout)/bottom-nav';
import { BaseSidebar } from '../(components)/(layout)/base-sidebar';
import { InitialConfigGuard } from '../(components)/(layout)/initial-config-guard';
import { usePeriodInvalidation } from '../(hooks)/use-period-invalidation';
import { useIsMobile } from '@/hooks/use-mobile';

export const PrivateLayout = ({ children }: React.PropsWithChildren) => {
  usePeriodInvalidation();
  const isMobile = useIsMobile();

  return (
    <InitialConfigGuard>
      <SidebarProvider>
        {!isMobile && <BaseSidebar />}
        <div className="flex-1 overflow-hidden pb-16 md:pb-0">{children}</div>
        <BottomNav />
      </SidebarProvider>
    </InitialConfigGuard>
  );
};

export default PrivateLayout;
