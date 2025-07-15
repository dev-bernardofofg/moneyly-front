export type Transaction = {
  id: string;
  userId: string;
  type: "income" | "expense";
  amount: number;
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
    totalCount: number;
    totalExpense: number;
    totalIncome: number;
    monthlyIncome: number;
    percentUsed: number;
    alert: string | null;
  };
};

export type TransactionRequest = {
  pagination: Pagination;
  category?: string;
  startDate?: string;
  endDate?: string;
};
