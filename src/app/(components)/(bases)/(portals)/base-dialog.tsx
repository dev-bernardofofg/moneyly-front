'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createContext, useContext, useRef, useState } from 'react';

/** true = pode fechar; false = bloquear (pedir confirmação). */
type CloseGuard = () => boolean;

const DialogGuardContext = createContext<{
  setGuard: (guard: CloseGuard | null) => void;
} | null>(null);

/** Form filho registra um guard de fechamento (ex.: bloquear se sujo). */
export const useDialogCloseGuard = () => useContext(DialogGuardContext);

interface BaseDialogProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const BaseDialog = ({
  trigger,
  children,
  title,
  description,
  open,
  onOpenChange,
}: BaseDialogProps) => {
  const guardRef = useRef<CloseGuard | null>(null);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;
  const actualOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (next: boolean) => {
    if (
      !next &&
      guardRef.current &&
      !guardRef.current() &&
      !window.confirm('Descartar alterações não salvas?')
    ) {
      return;
    }
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DialogGuardContext.Provider
      value={{
        setGuard: (guard) => {
          guardRef.current = guard;
        },
      }}
    >
      <Dialog open={actualOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="overflow-y-auto max-h-full">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          {children}
        </DialogContent>
      </Dialog>
    </DialogGuardContext.Provider>
  );
};
