import { PaginationType } from "./pagination.type";

export type Transaction = {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: string;
  description: string;
  date: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  };
};

export type TransactionResponse = {
  success: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: PaginationType;
    totalExpense: number;
    totalIncome: number;
    monthlyIncome: number;
    percentUsed: number;
    alert: string | null;
  };
};

export type TransactionRequest = {
  pagination?: PaginationType;
  category?: string;
  startDate?: string;
  endDate?: string;
};
