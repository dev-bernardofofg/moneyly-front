"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { BaseSidebar } from "../(components)/(bases)/base-sidebar";

export const PrivateLayout = ({ children }: ChildrenProps) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col w-full h-screen">
        <div className="bg-background w-full">
          <BaseSidebar />
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PrivateLayout;
