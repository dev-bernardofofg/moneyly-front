export type ErrorResponse = {
  data?: {
    error?: string;
  };
};

export const getErrorMessage = (error: ErrorResponse) => {
  return error.data?.error || "Erro inesperado";
};
