"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { BaseSidebar } from "../(components)/(layout)/base-sidebar";
import { InitialConfigGuard } from "../(components)/(layout)/initial-config-guard";

export const PrivateLayout = ({ children }: ChildrenProps) => {
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
