'use client';

import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { DialogClose } from '@/components/ui/dialog';

interface DialogFormFooterProps {
  submitLabel: string;
  isLoading?: boolean;
  hideCancel?: boolean;
}

export const DialogFormFooter = ({ submitLabel, isLoading, hideCancel }: DialogFormFooterProps) => {
  return (
    <div className="flex items-center justify-end gap-2 pt-2">
      {!hideCancel && (
        <DialogClose asChild>
          <BaseButton type="button" variant="outline" className="min-w-24">
            Cancelar
          </BaseButton>
        </DialogClose>
      )}
      <BaseButton type="submit" className="min-w-28" isLoading={isLoading}>
        {submitLabel}
      </BaseButton>
    </div>
  );
};
