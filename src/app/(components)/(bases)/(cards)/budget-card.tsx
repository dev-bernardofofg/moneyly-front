"use client";

import { getErrorMessage } from "@/app/(helpers)/errors";
import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";
import { FN_UTILS_STRING } from "@/app/(helpers)/string";
import { ConfirmActionForm } from "@/app/(resources)/(forms)/confirm-action";
import { UpsertBudgetForm } from "@/app/(resources)/(forms)/upsert-budget.form";
import { budgetQueryData, DeleteBudget } from "@/app/(services)/budget.service";
import { Budget } from "@/app/(types)/budget";
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
import { BaseDialog } from "../(portals)/base-dialog";
import { BaseButton } from "../base-button";


interface BudgetCardProps {
  budget: Budget;
}

export const BudgetCard = ({
  budget,
}: BudgetCardProps) => {

  const queryClient = useQueryClient()
  const { mutate: deleteBudget, isPending } = DeleteBudget({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [budgetQueryData.getBudgets] })
      toast.success("Orçamento removido com sucesso")
    },
    onError: (error) => {
      toast.error(getErrorMessage(error))
    }
  })

  const getBudgetStatus = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;

    return {
      text: percentage >= 100
        ? "Limite excedido"
        : percentage >= 90
          ? "Limite crítico"
          : percentage >= 75
            ? "Atenção"
            : "No controle",
      color: percentage >= 100
        ? "bg-red-500"
        : percentage >= 90
          ? "bg-red-400"
          : percentage >= 75
            ? "bg-yellow-400 text-black"
            : "bg-green-500 text-black"
    };
  };

  const getBudgetIcon = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;

    if (percentage >= 100) {
      return {
        icon: XCircle,
        color: "text-red-500",
        title: "Limite excedido"
      };
    } else if (percentage >= 90) {
      return {
        icon: TriangleAlert,
        color: "text-red-400",
        title: "Limite crítico"
      };
    } else if (percentage >= 75) {
      return {
        icon: AlertTriangle,
        color: "text-yellow-400",
        title: "Atenção"
      };
    } else {
      return {
        icon: CheckCircle,
        color: "text-green-500",
        title: "No controle"
      };
    }
  };

  const status = getBudgetStatus(Number(budget.spent), Number(budget.monthlyLimit));
  const iconConfig = getBudgetIcon(Number(budget.spent), Number(budget.monthlyLimit));
  const IconComponent = iconConfig.icon;

  const getProgressBarColor = (percentage: number) => {
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 90) return "bg-red-400";
    if (percentage >= 75) return "bg-yellow-400";
    return "bg-green-500";
  };

  const handleDelete = () => {
    deleteBudget(budget.id)
  }

  return (
    <div className="dark:bg-slate-700 bg-slate-100 border dark:border-slate-600 border-slate-300 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center justify-center transition-colors ${iconConfig.color}`}
            title={iconConfig.title}
          >
            <IconComponent className="size-5" />
          </div>
          <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">{budget.category.name}</h3>
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium ${status.color}`}>
          {status.text}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="dark:text-slate-400 text-slate-600">Gasto</span>
          <span className="font-medium dark:text-slate-200 text-slate-600">
            {FN_UTILS_NUMBERS.formatNumberToCurrency(budget.spent)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="dark:text-slate-400 text-slate-600">Limite</span>
          <span className="dark:text-slate-200 text-slate-600">
            {FN_UTILS_STRING.formatNumberToCurrency(budget.monthlyLimit)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="w-full dark:bg-slate-600 bg-slate-300 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${getProgressBarColor(budget.percentage)}`}
              style={{ width: `${Math.min(budget.percentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-400">
            <span>{budget.percentage.toFixed(0)}% usado</span>
            <span>{FN_UTILS_NUMBERS.formatCurrencyToNumber(budget.remaining)} restante</span>
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