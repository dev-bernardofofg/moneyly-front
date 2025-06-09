"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { IconType } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarItemProps {
  href: string;
  title: string;
  Icon: IconType;
  className?: string;
}

const SidebarItem = ({ Icon, href, title, className }: SidebarItemProps) => {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      id="sidebar-item"
      className={`group/item flex gap-3 w-full items-center transition-all ${
        active && "text-primary"
      } hover:text-primary`}
    >
      <div
        className={`w-1 h-full ${
          active
            ? "bg-primary"
            : "group-hover/item:bg-primary  bg-neutral-100/10 "
        } rounded-full`}
      />
      <div className="flex items-center gap-3">
        <Icon size={16} />
        {title}
      </div>
    </Link>
  );
};

export const BaseSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarItem Icon={Home} href="/dashboard" title="Início" />
      </SidebarHeader>

      <SidebarSeparator />
      <SidebarContent className="p-2 space-y-2">
        <SidebarItem Icon={Home} href="/route1" title="Rota 1" />
        <SidebarItem Icon={Home} href="/route2" title="Rota 2" />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};
