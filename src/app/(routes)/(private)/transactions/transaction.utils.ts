import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";

export const TRANSACTION_STATS_INTERATOR = [
  {
    name: "Saldo",
    indicator: "balance",
    icon: DollarSign,
    description: "Saldo Disponível",
    isMonetary: true,
    variant: "default",
    loading: false,
  },
  {
    name: "Entradas",
    indicator: "totalIncome",
    icon: TrendingUp,
    description: "Entradas totais",
    isMonetary: true,
    variant: "default",
    loading: false,
  },
  {
    name: "Saídas",
    indicator: "totalExpense",
    icon: TrendingDown,
    description: "Gastos totais",
    isMonetary: true,
    variant: "destructive",
    loading: false,
  },
] as const;
