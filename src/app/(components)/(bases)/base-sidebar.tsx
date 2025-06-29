"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { IconType } from "@/lib/utils";
import { Home, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../(elements)/logo";

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
      className={`group/item flex gap-2 w-full items-center transition-all text-slate-950 dark:text-white text-sm  ${active && "text-primary"
        } hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/10 p-2 rounded-md`}
    >
      <div
        className={`w-1 h-full ${active
          ? "bg-primary"
          : "group-hover/item:bg-primary  bg-neutral-900/40 dark:bg-neutral-200/40 "
          } rounded-full`}
      />
      <div className="flex items-center gap-3">
        <Icon className="size-4" />
        {title}
      </div>
    </Link>
  );
};


export const BaseSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <Logo className="w-full" fullName href animate={false} />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarItem Icon={Home} href="/route1" title="Rota 1" />
        <SidebarItem Icon={Home} href="/route2" title="Rota 2" />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="flex items-center gap-2 p-2">
          <User className="size-4" />
          <span className="text-sm">Perfil</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
