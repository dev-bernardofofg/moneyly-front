export type UpsertGoalRequest = {
  id?: string;
  title: string;
  description?: string;
  targetAmount: number;
  targetDate: string;
};

export type Goal = {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  startDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  milestones: Milestone[];
};

export type Milestone = {
  id: string;
  goalId: string;
  percentage: number;
  amount: number;
  isReached: boolean;
  reachedAt: string;
  createdAt: string;
};

export type UpsertGoalResponse = {
  success: boolean;
  data: null;
  message: string;
};

export type AddValueToGoalRequest = {
  goalId: string;
  amount: number;
};

export type AddValueToGoalResponse = {
  success: boolean;
  data: null;
  message: string;
};

export type GetGoalsResponse = {
  success: boolean;
  data: Goal[];
  message: string;
};
