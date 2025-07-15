import { BaseDialog } from '@/app/(components)/(bases)/(portals)/base-dialog';
import { BaseButton } from '@/app/(components)/(bases)/base-button';
import { TrashIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface ConfirmActionFormProps {
  onConfirm: () => void;
}

export const ConfirmActionForm = ({ onConfirm }: ConfirmActionFormProps) => {
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
      title="Confirmar ação"
      description="Tem certeza que deseja confirmar a ação?"
      trigger={<BaseButton variant="destructive" className='w-fit'>
        <TrashIcon className="size-4" />
      </BaseButton>}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="flex items-center gap-2">
        <BaseButton variant="secondary" onClick={handleClose}>
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
