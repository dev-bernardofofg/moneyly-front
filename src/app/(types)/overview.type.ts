export interface Overview {
  stats: StatsResponse;
  currentPeriod: CurrentPeriodResponse;
  monthlyHistory: MonthlyHistoryResponse[];
  expensesByCategory: ExpensesByCategoryResponse[];
  alerts: string[];
  transactionsCount: number;
}

export interface OverviewParams {
  userId: string;
}

export interface OverviewPlanner {
  stats: StatsPlannerResponse;
  currentPeriod: CurrentPeriodResponse;
  alerts: AlertsPlannerResponse[];
}

export interface StatsResponse {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  percentUsed: number;
  remainingBudget: number;
}

export interface StatsPlannerResponse {
  totalBudgeted: number;
  totalSavingsGoal: number;
  totalSaved: number;
  savingsGoalProgress: number;
  budgetPercentage: number;
  savingsPercentage: number;
  remainingToSave: number;
  availableForBudget: number;
}

export interface CurrentPeriodResponse {
  startDate: string;
  endDate: string;
  description: string;
}

export interface MonthlyHistoryResponse {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface AlertsPlannerResponse {
  type: "info" | "warning" | "error";
  message: string;
  priority: string;
  goal: string;
  daysRemaining: number;
}

export interface ExpensesByCategoryResponse {
  id: string;
  name: string;
  amount: number;
  percentage: number;
}

export interface OverviewResponse {
  success: boolean;
  message: string;
  data: Overview;
}

export interface OverviewPlannerResponse {
  success: boolean;
  message: string;
  data: OverviewPlanner;
}
