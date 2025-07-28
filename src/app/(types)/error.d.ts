export type ErrorDetails = {
  message: string;
  name: string;
  status: number;
};

export type ErrorResponse = {
  details: ErrorDetails;
  error: string;
  success: boolean;
};

export type CustomAxiosError = {
  data: ErrorResponse;
  status: number;
  message: string;
};
