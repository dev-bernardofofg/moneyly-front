import { CategorySpecific } from "./category";

export type CreateBudgetRequest = {
  categoryId: string;
  monthlyLimit: number;
};

export type UpdateBudgetRequest = {
  id: string;
  monthlyLimit: number;
};

export type Budget = {
  id: string;
  userId: string;
  category: CategorySpecific;
  monthlyLimit: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: string;
};

export type UpsertBudgetResponse = {
  success: boolean;
  data: Budget;
  message: string;
};

export type GetBudgetsResponse = {
  success: boolean;
  data: Budget[];
  message: string;
};
