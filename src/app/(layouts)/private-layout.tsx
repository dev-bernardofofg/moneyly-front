"use client";

import { Header } from "@/app/(components)/(layout)/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { BaseSidebar } from "../(components)/(bases)/base-sidebar";
import { Fade } from "../(components)/(motions)/fade";

export const PrivateLayout = ({ children }: ChildrenProps) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col w-full h-screen">
        <Header />
        <div className="bg-background w-full">
          <BaseSidebar />
          <Fade className="max-w-[calc(100%-16rem)] w-full ml-auto p-4">
            {children}
          </Fade>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PrivateLayout;
