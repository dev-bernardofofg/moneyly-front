import { DollarSign, List, TrendingDown, TrendingUp } from "lucide-react";

export const DASHBOARD_STATS_INTERATOR = [
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
  {
    name: "Transações",
    indicator: "transactionsCount",
    icon: List,
    description: "Total de transações",
    loading: false,
  },
];
