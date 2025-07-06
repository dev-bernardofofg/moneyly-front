export declare interface SignInParams {
  email: string;
  password: string;
}

export declare interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      name: string;
      email: string;
      monthlyIncome?: number;
      financialDayStart?: number;
      financialDayEnd?: number;
      createdAt: string;
    };
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
