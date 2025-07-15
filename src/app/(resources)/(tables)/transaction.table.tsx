"use client"

import { BaseTable } from "@/app/(components)/(bases)/(tables)/base-table";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { queryClient } from "@/app/(contexts)";
import { FN_UTILS_NUMBERS } from "@/app/(helpers)/number";
import { DeleteTransactionRequest, transactionQueryData } from "@/app/(services)/transaction.service";
import { Transaction } from "@/app/(types)/transaction";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Info, PencilIcon, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { ConfirmActionForm } from "../(forms)/confirm-action";

interface TransactionTableProps {
  transactions: Transaction[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const { mutate } = DeleteTransactionRequest({
    onSuccess: () => {
      toast.success('Transação deletada com sucesso');
      queryClient.invalidateQueries({ queryKey: [transactionQueryData.getTransaction] });
    },
    onError: () => {
      toast.error('Erro ao deletar transação');
    },
  });

  return <BaseTable data={transactions} columns={[
    {
      header: "Tipo",
      accessorKey: "type",
      cell: (value) => {
        return (
          <Badge variant={value === "income" ? "default" : "destructive"} className="w-24">
            {value === "income" ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
            <span className="text-sm font-medium">{value === "income" ? "Entrada" : "Saída"}</span>
          </Badge>
        )
      },
    },
    {
      header: "Título",
      accessorKey: "title",
      cell: (value, item) => {
        return <span className="text-sm font-medium text-muted-foreground">
          {item.title}
        </span>
      }
    },
    {
      header: "Categoria",
      accessorKey: "category",
      cell: (value, item) => {
        return <span className="text-sm font-medium text-muted-foreground">
          {item.category.name}
        </span>
      }
    },
    {
      header: "Valor",
      accessorKey: "amount",
      cell: (value, item) => {
        return <span className="text-sm font-medium text-muted-foreground">
          {FN_UTILS_NUMBERS.formatCurrencyToNumber(item.amount)}
        </span>
      }
    },
    {
      header: "Criação",
      accessorKey: "createdAt",
      cell: (value, item) => {
        return <span className="text-sm font-medium text-muted-foreground">
          {format(item.createdAt, "dd/MM/yyyy HH:mm")}
        </span>
      }
    },
    {
      header: "Atualização",
      accessorKey: "updatedAt",
      cell: (value, item) => {
        return <span className="text-sm font-medium text-muted-foreground">
          {format(item.updatedAt, "dd/MM/yyyy HH:mm")}
        </span>
      }
    },
    {
      header: "Ações",
      accessorKey: "id",
      cell: (value, item) => {
        return <div className="flex items-center gap-2">
          <BaseButton className='w-fit'>
            <PencilIcon className="size-4" />
          </BaseButton>
          <ConfirmActionForm onConfirm={() => mutate(item.id)} />
          <Tooltip>
            <TooltipTrigger>
              <Info className="size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <span className="text-sm font-medium text-muted-foreground">
                {item.description === "" ? "Nenhuma descrição" : item.description}
              </span>
            </TooltipContent>
          </Tooltip>
        </div>
      },
    }

  ]} />;
};  