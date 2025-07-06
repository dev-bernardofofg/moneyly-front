'use client'

import { InitialConfigForm } from '@/app/(resources)/(forms)/initial-config.form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { DollarSign } from 'lucide-react'

interface InitialConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}


export const InitialConfigDialog = ({ open, onOpenChange: _onOpenChange, onSuccess }: InitialConfigDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={_onOpenChange}>
      <DialogTitle className="sr-only" >Configurações Financeiras</DialogTitle>
      <DialogDescription className="sr-only" >Defina seu rendimento e período financeiro</DialogDescription>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0" onPointerDownOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="size-12  bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <DollarSign className="size-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
              Configurações Financeiras
            </CardTitle>
            <CardDescription className="text-base text-gray-600 dark:text-white/40">
              Defina seu rendimento e período financeiro
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <InitialConfigForm onSuccess={() => {
              _onOpenChange(false)
              onSuccess()
            }} />
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
} 