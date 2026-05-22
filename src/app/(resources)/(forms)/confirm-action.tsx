import { BaseButton } from '@/app/(components)/(bases)/(clickable)/base-button';
import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { PowerIcon, TrashIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface ConfirmActionFormProps {
  onConfirm: () => void;
  title: string;
  description: string;
  trigger: React.ReactNode;
  isLoading?: boolean;

  variant?: 'default' | 'active';
}

export const ConfirmActionForm = ({
  onConfirm,
  title,
  description,
  trigger,
  variant = 'default',
  isLoading,
}: ConfirmActionFormProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <BaseDialog
      title={title}
      description={description}
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex items-center gap-2">
        <BaseButton variant="outline" className="w-full" onClick={handleClose}>
          <XIcon className="size-4" />
          Cancelar
        </BaseButton>
        <BaseButton
          variant={variant === 'active' ? 'default' : 'destructive'}
          className="w-full"
          onClick={handleConfirm}
          isLoading={isLoading}
        >
          {variant === 'active' ? (
            <PowerIcon className="size-4" />
          ) : (
            <TrashIcon className="size-4" />
          )}
          Confirmar
        </BaseButton>
      </div>
    </BaseDialog>
  );
};
