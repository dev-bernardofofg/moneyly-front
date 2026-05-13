// Bridge: re-exports kubb types for orval hooks.
// Regenerate with: pnpm generate-hooks (then restore this file).
export * from "../types/index.ts";

// Aliases: orval uses "Body" / "Params", kubb uses "MutationRequest" / "QueryParams"
export type { PostAuthSignUpMutationRequest as PostAuthSignUpBody } from "../types/PostAuthSignUp.ts";
export type { PostAuthSignInMutationRequest as PostAuthSignInBody } from "../types/PostAuthSignIn.ts";
export type { PostAuthGoogleMutationRequest as PostAuthGoogleBody } from "../types/PostAuthGoogle.ts";
export type { PostAuthRefreshMutationRequest as PostAuthRefreshBody } from "../types/PostAuthRefresh.ts";
export type { PostAuthLogoutMutationRequest as PostAuthLogoutBody } from "../types/PostAuthLogout.ts";

export type { PostBudgetsMutationRequest as PostBudgetsBody } from "../types/PostBudgets.ts";
export type { PutBudgetsIdMutationRequest as PutBudgetsIdBody } from "../types/PutBudgetsId.ts";

export type { GetCategoriesQueryParams as GetCategoriesParams } from "../types/GetCategories.ts";
export type { PostCategoriesCreateMutationRequest as PostCategoriesCreateBody } from "../types/PostCategoriesCreate.ts";
export type { PutCategoriesUpdateIdMutationRequest as PutCategoriesUpdateIdBody } from "../types/PutCategoriesUpdateId.ts";

export type { PostGoalsMutationRequest as PostGoalsBody } from "../types/PostGoals.ts";
export type { PostGoalsIdAddAmountMutationRequest as PostGoalsIdAddAmountBody } from "../types/PostGoalsIdAddAmount.ts";
export type { PutGoalsIdMutationRequest as PutGoalsIdBody } from "../types/PutGoalsId.ts";

export type { GetOverviewDashboardQueryParams as GetOverviewDashboardParams } from "../types/GetOverviewDashboard.ts";

export type { GetTransactionsQueryParams as GetTransactionsParams } from "../types/GetTransactions.ts";
export type { PostTransactionsCreateMutationRequest as PostTransactionsCreateBody } from "../types/PostTransactionsCreate.ts";
export type { PutTransactionsIdMutationRequest as PutTransactionsIdBody } from "../types/PutTransactionsId.ts";

export type { GetUserFinancialPeriodsPeriodid200 as GetUserFinancialPeriodsPeriodId200 } from "../types/GetUserFinancialPeriodsPeriodid.ts";
export type { PutUserFinancialPeriodMutationRequest as PutUserFinancialPeriodBody } from "../types/PutUserFinancialPeriod.ts";
export type { PutUserIncomeMutationRequest as PutUserIncomeBody } from "../types/PutUserIncome.ts";
export type { PutUserIncomeAndPeriodMutationRequest as PutUserIncomeAndPeriodBody } from "../types/PutUserIncomeAndPeriod.ts";

// Types that exist in orval-generated schemas but not in kubb types
export type TransactionCategory = { id: string; name: string };
