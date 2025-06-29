"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { BaseSidebar } from "../(components)/(bases)/base-sidebar";

export const PrivateLayout = ({ children }: ChildrenProps) => {
  return (
    <SidebarProvider>
      <BaseSidebar />
      {children}
    </SidebarProvider>
  );
};

export default PrivateLayout;
