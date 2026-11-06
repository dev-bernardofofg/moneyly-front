import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SidebarProvider } from '@/components/ui/sidebar';
import { BaseSidebar } from './base-sidebar';
import { BottomNav } from './bottom-nav';
import { MORE_NAV_ITEMS, PRIMARY_NAV_ITEMS } from './navigation';

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn() }),
}));
vi.mock('next-themes', () => ({
  useTheme: () => ({ setTheme: vi.fn(), resolvedTheme: 'light', theme: 'light' }),
}));
vi.mock('@/contexts/auth-provider', () => ({
  useAuth: () => ({ user: { name: 'Ana', email: 'ana@example.com' }, signOut: vi.fn() }),
}));
vi.mock('@/components/layout/install-pwa-button', () => ({ InstallPWAButton: () => null }));

afterEach(cleanup);

describe('navegação', () => {
  it('foca a rotina semanal no grupo principal e leva o resto para Mais', () => {
    expect(PRIMARY_NAV_ITEMS.map((item) => item.label)).toEqual([
      'Início',
      'Check-in',
      'Transações',
      'Horas Extras',
    ]);
    expect(MORE_NAV_ITEMS.map((item) => item.label)).toEqual([
      'Gastos',
      'Recorrentes',
      'Contas e cartões',
      'Categorias',
      'Perfil',
    ]);
    expect(PRIMARY_NAV_ITEMS.map((item) => item.href)).toContain('/check-in');
  });

  it('sidebar mostra os dois grupos e não mostra Planejamento', () => {
    render(
      <SidebarProvider>
        <BaseSidebar />
      </SidebarProvider>
    );

    for (const { label } of [...PRIMARY_NAV_ITEMS, ...MORE_NAV_ITEMS]) {
      expect(screen.getAllByText(label).length).toBeGreaterThan(0);
    }
    expect(screen.getByText('Mais')).toBeInTheDocument();
    expect(screen.queryByText('Planejamento')).not.toBeInTheDocument();
  });

  it('barra inferior mostra os itens principais e o botão Mais', () => {
    render(<BottomNav />);

    for (const { label } of PRIMARY_NAV_ITEMS) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.getByText('Mais')).toBeInTheDocument();
    expect(screen.queryByText('Planejamento')).not.toBeInTheDocument();
  });
});
