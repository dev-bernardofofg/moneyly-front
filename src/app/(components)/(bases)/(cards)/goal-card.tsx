import { queryClient } from '@/app/(contexts)'
import { getErrorMessage } from '@/app/(helpers)/errors'
import { FN_UTILS_NUMBERS } from '@/app/(helpers)/number'
import { AddValueToGoalForm } from '@/app/(resources)/(forms)/add-value-to-goal.form'
import { ConfirmActionForm } from '@/app/(resources)/(forms)/confirm-action'
import { UpsertGoalForm } from '@/app/(resources)/(forms)/upsert-goal.form'
import { DeleteGoal, goalQueryData } from '@/app/(services)/goal.service'
import { Goal } from '@/app/(types)/goal.type'
import { differenceInDays, format } from 'date-fns'
import { Calendar, CheckCircle, Clock, Edit3, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { BaseDialog } from '../(portals)/base-dialog'
import { BaseButton } from '../base-button'

interface GoalCardProps {
  goal: Goal
}

export const GoalCard = ({ goal }: GoalCardProps) => {
  const { mutate: deleteGoal } = DeleteGoal({
    onSuccess: () => {
      toast.success("Meta removida com sucesso")
      queryClient.invalidateQueries({ queryKey: [goalQueryData.getGoals] })
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    }
  })

  const handleDeleteGoal = () => {
    deleteGoal(goal.id)
  }

  return (
    <div className="dark:bg-slate-700 bg-slate-100 border dark:border-slate-600 border-slate-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">{goal.title}</h3>
        {goal.isActive && <CheckCircle className="size-5 text-primary" />}
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Progresso</span>
            <span className="font-medium dark:text-slate-200 text-slate-900">{FN_UTILS_NUMBERS.formatPercentageFormatted(goal.currentAmount / goal.targetAmount * 100)}</span>
          </div>
          <div className="w-full dark:bg-slate-600 bg-slate-300 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-primary transition-all"
              style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-primary font-medium">
              {FN_UTILS_NUMBERS.formatNumberToCurrency(goal.currentAmount)}
            </span>
            <span className="text-slate-400">{FN_UTILS_NUMBERS.formatNumberToCurrency(goal.targetAmount)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="size-4" />
            <span>{format(goal.targetDate, 'dd/MM/yyyy')}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="size-4" />
            <span className={goal.targetDate < new Date().toISOString() ? "text-yellow-400 font-medium" : ""}>
              {goal.targetDate > new Date().toISOString() ? `${differenceInDays(new Date(goal.targetDate), new Date())} dias` : "Vencido"}
            </span>
          </div>
        </div>

        <div className="dark:bg-slate-600 bg-slate-200 p-2 rounded-lg flex items-center justify-between">
          <div className="text-sm dark:text-slate-400 text-slate-600">Faltam</div>
          <div className="font-semibold text-lg dark:text-slate-100 text-slate-600">
            R$ {(goal.targetAmount - goal.currentAmount).toLocaleString("pt-BR")}
          </div>
        </div>

        <div className="flex gap-2">
          <BaseDialog
            title="Adicionar valor"
            description="Adicione um valor à meta"
            trigger={<BaseButton size="sm">
              <Plus className="size-3 mr-1" />
              Adicionar
            </BaseButton>}
          >
            <AddValueToGoalForm goalId={goal.id} />
          </BaseDialog>

          <BaseDialog
            title="Editar meta"
            description="Edite a meta"
            trigger={<BaseButton size="sm" variant="outline">
              <Edit3 className="size-3 mr-1" />
              Editar
            </BaseButton>}
          >
            <UpsertGoalForm goal={goal} />
          </BaseDialog>

          <ConfirmActionForm
            title="Remover meta"
            description="Tem certeza que deseja remover esta meta?"
            onConfirm={handleDeleteGoal}
            trigger={
              <BaseButton size="sm" variant="outline">
                <Trash2 className="size-3 mr-1" />
                Remover
              </BaseButton>
            }
          />
        </div>
      </div>
    </div>
  )
}
