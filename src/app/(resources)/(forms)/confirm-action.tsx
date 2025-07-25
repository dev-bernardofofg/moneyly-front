import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { BaseButton } from '@/app/(components)/(bases)/base-button';
import { TrashIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface ConfirmActionFormProps {
  onConfirm: () => void;
  title: string;
  description: string;
  trigger: React.ReactNode;
}

export const ConfirmActionForm = ({ onConfirm, title, description, trigger }: ConfirmActionFormProps) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(!open);
  }

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  }

  return (
    <BaseDialog
      title={title}
      description={description}
      trigger={trigger}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex items-center gap-2">
        <BaseButton variant="outline" onClick={handleClose}>
          <XIcon className="size-4" />
          Cancelar
        </BaseButton>
        <BaseButton variant="destructive" onClick={handleConfirm} >
          <TrashIcon className="size-4" />
          Confirmar
        </BaseButton>
      </div>
    </BaseDialog>
  )
}
