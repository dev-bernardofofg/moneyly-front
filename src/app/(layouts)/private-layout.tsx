"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthGuard } from "../(components)/(layout)/auth-guard";
import { BaseSidebar } from "../(components)/(layout)/base-sidebar";
import { InitialConfigGuard } from "../(components)/(layout)/initial-config-guard";

export const PrivateLayout = ({ children }: ChildrenProps) => {
  return (
    <AuthGuard>
      <InitialConfigGuard>
        <SidebarProvider>
          <BaseSidebar />
          {children}
        </SidebarProvider>
      </InitialConfigGuard>
    </AuthGuard>
  );
};

export default PrivateLayout;
