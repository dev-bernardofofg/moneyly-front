import { CustomAxiosError, ErrorDetails } from "../(types)/error";

export const getErrorMessage = (error: CustomAxiosError) => {
  if (error?.data) {
    const errorData = error.data;

    if (errorData.details && errorData.details.length > 0) {
      return errorData.details
        .map((detail: ErrorDetails) => detail.message)
        .join(", ");
    }

    if (errorData.error) {
      return errorData.error;
    }
  }

  return error?.message || "Erro inesperado";
};

export const getFieldError = (error: any, fieldName: string) => {
  if (error?.data?.details) {
    const fieldError = error.data.details.find(
      (detail: ErrorDetails) => detail.field === fieldName
    );
    return fieldError?.message || null;
  }
  return null;
};
