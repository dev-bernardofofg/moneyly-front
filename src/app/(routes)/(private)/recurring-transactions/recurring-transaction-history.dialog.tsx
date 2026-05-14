"use client";

import { BaseButton } from "@/app/(components)/(bases)/(clickable)/base-button";
import { BaseDialog } from "@/app/(components)/(bases)/(portals)/base-dialog";
import { FN_UTILS_STRING } from "@/app/(helpers)/string";
import { useGetRecurringTransactionsIdTransactions } from "@/app/(resources)/(generated)/hooks/recurring-transactions/recurring-transactions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { History, Loader2, TrendingDown, TrendingUp } from "lucide-react";

interface RecurringTransactionHistoryDialogProps {
  recurringTransactionId: string;
  title: string;
}

export const RecurringTransactionHistoryDialog = ({
  recurringTransactionId,
  title,
}: RecurringTransactionHistoryDialogProps) => {
  return (
    <BaseDialog
      title={`Histórico — ${title}`}
      description="Transações geradas por esta recorrência"
      trigger={
        <BaseButton variant="outline" className="w-fit">
          <History className="size-4" />
        </BaseButton>
      }
    >
      <HistoryContent recurringTransactionId={recurringTransactionId} />
    </BaseDialog>
  );
};

const HistoryContent = ({ recurringTransactionId }: { recurringTransactionId: string }) => {
  const { data, isLoading } = useGetRecurringTransactionsIdTransactions(recurringTransactionId);
  const transactions = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        Nenhuma transação gerada ainda.
      </p>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tipo</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell>
                <Badge variant={tx.type === "income" ? "default" : "destructive"} className="w-20">
                  {tx.type === "income" ? (
                    <TrendingUp className="size-3.5" />
                  ) : (
                    <TrendingDown className="size-3.5" />
                  )}
                  <span className="text-xs">{tx.type === "income" ? "Entrada" : "Saída"}</span>
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {tx.date ? format(tx.date, "dd/MM/yyyy") : "—"}
              </TableCell>
              <TableCell className="text-sm font-medium text-muted-foreground">
                {FN_UTILS_STRING.formatNumberToCurrency(tx.amount?.toString() || "0")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
