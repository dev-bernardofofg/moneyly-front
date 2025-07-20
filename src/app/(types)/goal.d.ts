export declare type UpsertGoalRequest = {
  id?: string;
  title: string;
  description?: string;
  targetAmount: number;
  targetDate: string;
};

export declare type Goal = {
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

declare type Milestone = {
  id: string;
  goalId: string;
  percentage: number;
  amount: number;
  isReached: boolean;
  reachedAt: string;
  createdAt: string;
};

export declare type UpsertGoalResponse = {
  success: boolean;
  data: null;
  message: string;
};

export declare type AddValueToGoalRequest = {
  goalId: string;
  amount: number;
};

export declare type AddValueToGoalResponse = {
  success: boolean;
  data: null;
  message: string;
};

export declare type GetGoalsResponse = {
  success: boolean;
  data: Goal[];
  message: string;
};
