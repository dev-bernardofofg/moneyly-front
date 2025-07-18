"use client";

import { useAuth } from "@/app/(contexts)/auth-provider";
import { FN_UTILS_STRING } from "@/app/(helpers)/string";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { IconType } from "@/lib/utils";
import { ChevronUp, Home, LogOut, Moon, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
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
        <Icon className={`size-4 ${active ? "text-primary group-hover/item:text-primary" : "group-hover/item:text-neutral-200"}`} />
        <span className={`${active ? "text-primary group-hover/item:text-primary" : "group-hover/item:text-neutral-200"}`}>{title}</span>
      </div>
    </Link>
  );
};


export const BaseSidebar = () => {
  const { setTheme, resolvedTheme, theme } = useTheme();
  const { user, signOut } = useAuth();
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo className="w-full" fullName href animate={false} />
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarItem Icon={Home} href="/transactions" title="Transações" />
        <SidebarItem Icon={Home} href="/categories" title="Categorias" />
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-green-400 text-white">
                  {FN_UTILS_STRING.avatarUser(user?.name || "")}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
              </div>
              <ChevronUp className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="top"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem asChild>
              <a href="#" className="flex items-center gap-2 cursor-pointer">
                <User className="size-4" />
                <span>Perfil</span>
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={toggleTheme} className="flex items-center gap-2 cursor-pointer">
              {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
              <span>{theme === "light" ? "Modo Escuro" : "Modo Claro"}</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600">
              <LogOut className="size-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
