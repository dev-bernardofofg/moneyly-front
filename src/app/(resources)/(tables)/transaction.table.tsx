"use client"

import { BaseDialog } from "@/app/(components)/(bases)/(portals)/base-dialog";
import { BaseTable, BaseTableOptions } from "@/app/(components)/(bases)/(tables)/base-table";
import { BaseButton } from "@/app/(components)/(bases)/base-button";
import { queryClient } from "@/app/(contexts)";
import { FN_UTILS_STRING } from "@/app/(helpers)/string";
import { DeleteTransactionRequest, transactionQueryData } from "@/app/(services)/transaction.service";
import { Transaction } from "@/app/(types)/transaction.type";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
import { Info, PencilIcon, Trash2, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { ConfirmActionForm } from "../(forms)/confirm-action";
import { UpsertTransactionForm } from "../(forms)/upsert-transaction.form";

interface TransactionTableProps extends BaseTableOptions {
  transactions: Transaction[];
}

export const TransactionTable = ({ transactions, tableOptions, onPaginationChange }: TransactionTableProps) => {
  const { mutate } = DeleteTransactionRequest({
    onSuccess: () => {
      toast.success('Transação deletada com sucesso');
      queryClient.invalidateQueries({ queryKey: [transactionQueryData.getTransaction] });
    },
    onError: () => {
      toast.error('Erro ao deletar transação');
    },
  });

  return <BaseTable data={transactions}
    title="Transações"
    emptyMessage="Nenhuma transação encontrada"
    pagination={tableOptions.pagination}
    onPaginationChange={onPaginationChange}
    actions={(item) => (
      <div className="flex items-center gap-2">
        <BaseDialog title="Editar transação" description="Editar transação" trigger={
          <BaseButton className='w-fit'>
            <PencilIcon className="size-4" />
          </BaseButton>
        }>
          <UpsertTransactionForm transaction={item} />
        </BaseDialog>
        <ConfirmActionForm onConfirm={() => mutate(item.id)} title="Remover transação" description="Tem certeza que deseja remover esta transação?" trigger={
          <BaseButton variant="destructive" className="w-fit">
            <Trash2 className="size-4" />
          </BaseButton>
        } />
      </div>
    )}
    columns={[
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
          return <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <span>
              {item.title}
            </span>
            <Tooltip>
              <TooltipTrigger>
                <Info className="size-4" />
              </TooltipTrigger>
              <TooltipContent>
                <span>
                  {item.description === "" ? "Nenhuma descrição" : item.description}
                </span>
              </TooltipContent>
            </Tooltip>
          </div>
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
            {FN_UTILS_STRING.formatNumberToCurrency(item.amount.toString())}
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
    ]}

  />;
};  