'use client';

import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon, Plus } from 'lucide-react';
import { ReactNode, useState } from 'react';

export interface FabAction {
  icon: LucideIcon;
  label: string;
  dialogTitle: string;
  dialogDescription?: string;
  children: ReactNode;
}

// nav: 64px + gap: 8px = bottom-[72px] pro botão
// itens começam acima do botão: 72 + 56 (size-14) + 12 (gap-3) = 140px
const BTN_BOTTOM = 72;
const ITEMS_BOTTOM = BTN_BOTTOM + 56 + 12;

export const FabSpeedDial = ({ actions }: { actions: FabAction[] }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setOpen(false)} />}

      {/* Itens — container ancorado acima do botão, abre pra cima */}
      <div
        className="fixed right-6 z-50 flex flex-col-reverse items-end gap-3"
        style={{ bottom: ITEMS_BOTTOM }}
      >
        {actions.map((action, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center gap-2 transition-all duration-200',
              open
                ? 'opacity-100 translate-y-0 pointer-events-auto'
                : 'opacity-0 translate-y-10 pointer-events-none'
            )}
            style={{ transitionDelay: open ? `${i * 50}ms` : '0ms' }}
          >
            <span className="rounded-md border border-border bg-background px-2.5 py-1 text-sm font-medium shadow-md">
              {action.label}
            </span>
            <BaseDialog
              title={action.dialogTitle}
              description={action.dialogDescription}
              trigger={
                <Button
                  size="icon"
                  variant="secondary"
                  className="size-12 rounded-full shadow-md"
                  onClick={() => setOpen(false)}
                >
                  <action.icon className="size-5" />
                </Button>
              }
            >
              {action.children}
            </BaseDialog>
          </div>
        ))}
      </div>

      {/* Botão FAB */}
      <div className="fixed right-6 z-50" style={{ bottom: BTN_BOTTOM }}>
        <Button
          size="icon"
          className="size-14 rounded-full shadow-lg"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
        >
          <Plus className={cn('size-6 transition-transform duration-200', open && 'rotate-45')} />
        </Button>
      </div>
    </>
  );
};
