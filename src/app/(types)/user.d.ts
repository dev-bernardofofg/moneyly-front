export declare type UpdateProfileResponse = {
  success: boolean;
  data: {
    monthlyIncome: number;
    financialDayStart: number;
    financialDayEnd: number;
    firstAccess: boolean;
  };
  message: string;
};
