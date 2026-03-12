"use client";

import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";
import { ConfirmActionForm } from "@/app/(resources)/(forms)/confirm-action";
import { UpsertBudgetForm } from "@/app/(resources)/(forms)/upsert-budget.form";
import { Budget } from "@/app/(resources)/(generated)";
import { useDeleteBudgetsId } from "@/app/(resources)/(generated)/hooks/budgets/budgets";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  CheckCircle,
  Edit3,
  Trash2,
  TriangleAlert,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { BaseButton } from "../(clickable)/base-button";
import { BaseDialog } from "../(portals)/base-dialog";

interface BudgetCardProps {
  budget: Budget;
}

const BUDGET_LEVELS = [
  { threshold: 100, label: "Limite excedido", badgeColor: "bg-red-500",           barColor: "bg-red-500",   icon: XCircle,       iconColor: "text-red-500"   },
  { threshold: 90,  label: "Limite crítico",  badgeColor: "bg-red-400",            barColor: "bg-red-400",   icon: TriangleAlert, iconColor: "text-red-400"   },
  { threshold: 75,  label: "Atenção",         badgeColor: "bg-yellow-400 text-black", barColor: "bg-yellow-400", icon: AlertTriangle, iconColor: "text-yellow-400" },
  { threshold: 0,   label: "No controle",     badgeColor: "bg-green-500 text-black",  barColor: "bg-green-500", icon: CheckCircle,   iconColor: "text-green-500" },
] as const;

const getBudgetLevel = (percentage: number) =>
  BUDGET_LEVELS.find((l) => percentage >= l.threshold) ?? BUDGET_LEVELS[3];

export const BudgetCard = ({ budget }: BudgetCardProps) => {
  const queryClient = useQueryClient()
  const { mutate: deleteBudget, isPending } = useDeleteBudgetsId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["getBudgets"] })
        toast.success("Orçamento removido com sucesso")
      },
    },
  })

  const percentage = budget.percentage || 0;
  const level = !budget.spent || !budget.monthlyLimit
    ? { label: "Sem dados", badgeColor: "bg-gray-500", barColor: "bg-gray-500", icon: CheckCircle, iconColor: "text-gray-500" }
    : getBudgetLevel(percentage);

  const IconComponent = level.icon;

  const handleDelete = () => {
    deleteBudget({ id: budget.id || "" })
  }

  return (
    <div className="dark:bg-slate-700 bg-slate-100 border dark:border-slate-600 border-slate-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center transition-colors ${level.iconColor}`}
            title={level.label}
          >
            <IconComponent className="size-5" />
          </div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">{budget.category?.name}</h3>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${level.badgeColor}`}>
          {level.label}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="dark:text-slate-400 text-slate-600">Gasto</span>
          <span className="font-medium dark:text-slate-200 text-slate-600">
            {FN_UTILS_NUMBERS.formatNumberToCurrency(budget.spent || 0)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="dark:text-slate-400 text-slate-600">Limite</span>
          <span className="dark:text-slate-200 text-slate-600">
            {FN_UTILS_NUMBERS.formatNumberToCurrency(budget.monthlyLimit || 0)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-full dark:bg-slate-600 bg-slate-300 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${level.barColor}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{percentage.toFixed(0)}% usado</span>
            <span>{FN_UTILS_NUMBERS.formatCurrencyToNumber(budget.remaining || 0)} restante</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <BaseDialog title="Editar Orçamento" trigger={<BaseButton variant="outline">
          <Edit3 className="w-3 h-3 mr-1" />
          Editar
        </BaseButton>}>
          <UpsertBudgetForm budget={budget} />
        </BaseDialog>
        <ConfirmActionForm
          onConfirm={handleDelete}
          title="Remover Orçamento"
          description="Tem certeza que deseja remover este orçamento?"
          trigger={<BaseButton variant="outline" className="w-full" isLoading={isPending}>
            <Trash2 className="w-3 h-3 mr-1" />
            Remover
          </BaseButton>}
        />
      </div>
    </div>
  );
};
