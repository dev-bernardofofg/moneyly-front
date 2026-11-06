import { ROUTES } from '@/lib/routes';
import type { IconType } from '@/lib/utils';
import {
  ArrowRightLeft,
  CalendarCheck,
  Clock,
  Home,
  Lightbulb,
  RefreshCcw,
  TableProperties,
  User,
  WalletCards,
} from 'lucide-react';

export interface NavItem {
  href: string;
  icon: IconType;
  label: string;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { href: ROUTES.DASHBOARD, icon: Home, label: 'Início' },
  { href: ROUTES.CHECK_IN, icon: CalendarCheck, label: 'Check-in' },
  { href: ROUTES.TRANSACTIONS, icon: ArrowRightLeft, label: 'Transações' },
  { href: ROUTES.OVERTIME, icon: Clock, label: 'Horas Extras' },
];

export const MORE_NAV_ITEMS: NavItem[] = [
  { href: ROUTES.INSIGHTS, icon: Lightbulb, label: 'Gastos' },
  { href: ROUTES.RECURRING_TRANSACTIONS, icon: RefreshCcw, label: 'Recorrentes' },
  { href: ROUTES.ACCOUNTS, icon: WalletCards, label: 'Contas e cartões' },
  { href: ROUTES.CATEGORIES, icon: TableProperties, label: 'Categorias' },
  { href: ROUTES.PROFILE, icon: User, label: 'Perfil' },
];
