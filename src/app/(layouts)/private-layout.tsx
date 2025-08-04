"use client";

import { ChildrenProps } from '@/app/(types)/global.type';
import { SidebarProvider } from "@/components/ui/sidebar";
import { BaseSidebar } from "../(components)/(layout)/base-sidebar";
import { InitialConfigGuard } from "../(components)/(layout)/initial-config-guard";
import { usePeriodInvalidation } from "../(hooks)/use-period-invalidation";

export const PrivateLayout = ({ children }: ChildrenProps) => {
  usePeriodInvalidation();

  return (
    <InitialConfigGuard>
      <SidebarProvider>
        <BaseSidebar />
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </SidebarProvider>
    </InitialConfigGuard>
  );
};

export default PrivateLayout;
