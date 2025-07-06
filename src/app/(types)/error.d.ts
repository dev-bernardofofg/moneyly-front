export type ErrorDetails = {
  field: string;
  message: string;
  code: string;
};

export type ErrorResponse = {
  details: ErrorDetails[];
  error: string;
  success: boolean;
};

export type CustomAxiosError = {
  status?: number;
  message: string;
  data: ErrorResponse;
};
