'use client';

import { useAuth } from '@/app/(contexts)/auth-provider';
import { cn } from '@/lib/utils';
import {
  ArrowRightLeft,
  Clock,
  Goal,
  Home,
  Lightbulb,
  LogOut,
  Moon,
  MoreHorizontal,
  RefreshCcw,
  Sun,
  TableProperties,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const NAV_ITEMS = [
  { href: '/dashboard', icon: Home, label: 'Dashboard' },
  { href: '/transactions', icon: ArrowRightLeft, label: 'Transações' },
  { href: '/planner', icon: Goal, label: 'Planejamento' },
  { href: '/insights', icon: Lightbulb, label: 'Insights' },
] as const;

const MORE_ITEMS = [
  { href: '/recurring-transactions', icon: RefreshCcw, label: 'Recorrentes' },
  { href: '/overtime', icon: Clock, label: 'Horas Extras' },
  { href: '/categories', icon: TableProperties, label: 'Categorias' },
  { href: '/profile', icon: User, label: 'Perfil' },
] as const;

export const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { signOut } = useAuth();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = MORE_ITEMS.some((item) => pathname === item.href);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 rounded-t-xl items-center border-t border-border bg-background md:hidden">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="size-5" />
              <span>{label}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setMoreOpen(true)}
          className={cn(
            'flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors',
            isMoreActive ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <MoreHorizontal className="size-5" />
          <span>Mais</span>
        </button>
      </nav>

      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl pb-10">
          <SheetHeader className="mb-2">
            <SheetTitle>Mais opções</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col gap-1">
            {MORE_ITEMS.map(({ href, icon: Icon, label }) => (
              <button
                key={href}
                onClick={() => {
                  router.push(href);
                  setMoreOpen(false);
                }}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors',
                  pathname === href
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-muted'
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            ))}

            <div className="my-2 border-t border-border" />

            <button
              onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-foreground transition-colors hover:bg-muted"
            >
              {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
              {resolvedTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
            </button>

            <button
              onClick={signOut}
              className="flex items-center gap-3 rounded-md px-3 py-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="size-5" />
              Sair
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
