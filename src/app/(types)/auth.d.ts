export declare interface SignInParams {
  email: string;
  password: string;
}

export declare interface GoogleSignInParams {
  token: string;
}

export declare interface User {
  id: string;
  name: string;
  email: string;
  monthlyIncome?: number;
  financialDayStart?: number;
  financialDayEnd?: number;
  createdAt: string;
}

export declare interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export declare interface SignUpParams {
  name: string;
  email: string;
  password: string;
}

export declare interface InitialConfigParams {
  monthlyIncome: number;
  financialDayStart: number;
  financialDayEnd: number;
}
