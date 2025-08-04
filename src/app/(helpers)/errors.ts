import { CustomAxiosError, ErrorDetails } from "../(types)/error.type";

export const getErrorMessage = (error: CustomAxiosError) => {
  if (error?.data) {
    const errorData = error.data.details;

    if (errorData.message) {
      return errorData.message;
    }
  }

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
