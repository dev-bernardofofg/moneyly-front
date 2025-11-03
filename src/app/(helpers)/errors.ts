import { CustomAxiosError, ErrorDetails } from "../(types)/error.type";

export const getErrorMessage = (error: CustomAxiosError) => {
  // Formato 1: error.data.error (formato padrão da API)
  if (error?.data?.error) {
    return error.data.error;
  }

  // Formato 2: error.data.details.message
  if (error?.data?.details?.message) {
    return error.data.details.message;
  }

  // Formato 3: error.data.message (pode vir em outro formato da API)
  if (error?.data && "message" in error.data) {
    return (error.data as any).message;
  }

  // Fallback
  return error?.message || "Erro inesperado";
};

export const getFieldError = (error: any, fieldName: string) => {
  if (error?.data?.details) {
    const fieldError = error.data.details.find(
      (detail: ErrorDetails) => detail.name === fieldName
    );
    return fieldError?.message || null;
  }
  return null;
};
