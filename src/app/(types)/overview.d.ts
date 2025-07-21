declare interface Overview {
  stats: StatsResponse;
  currentPeriod: CurrentPeriodResponse;
  monthlyHistory: MonthlyHistoryResponse[];
  expensesByCategory: ExpensesByCategoryResponse[];
  alerts: string[];
  transactionsCount: number;
}

declare interface OverviewPlanner {
  stats: StatsPlannerResponse;
  currentPeriod: CurrentPeriodPlannerResponse;
  alerts: AlertsPlannerResponse[];
}

declare interface StatsResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  percentUsed: number;
  remainingBudget: number;
}

declare interface StatsPlannerResponse {
  totalBudgeted: number;
  totalSavingsGoal: number;
  totalSaved: number;
  savingsGoalProgress: number;
  budgetPercentage: number;
  savingsPercentage: number;
  remainingToSave: number;
  availableForBudget: number;
}

declare interface CurrentPeriodResponse {
  startDate: string;
  endDate: string;
  description: string;
}

declare interface MonthlyHistoryResponse {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

declare interface AlertsPlannerResponse {
  type: "info" | "warning" | "error";
  message: string;
  priority: string;
  goal: string;
  daysRemaining: number;
}

declare interface ExpensesByCategoryResponse {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

export declare interface OverviewResponse {
  success: boolean;
  message: string;
  data: Overview;
}

export declare interface OverviewPlannerResponse {
  success: boolean;
  message: string;
  data: OverviewPlanner;
}
