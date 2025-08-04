export interface SignInParams {
  email: string;
  password: string;
}

export interface GoogleSignInParams {
  token: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  monthlyIncome?: number;
  financialDayStart?: number;
  financialDayEnd?: number;
  firstAccess?: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export interface InitialConfigParams {
  monthlyIncome: number;
  financialDayStart: number;
  financialDayEnd: number;
}
