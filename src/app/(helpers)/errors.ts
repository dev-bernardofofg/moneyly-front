import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { CustomAxiosError, ErrorDetails } from "../(types)/error.type";

export const extractApiErrorMessage = (data: unknown): string => {
  if (!data || typeof data !== 'object') return "Erro inesperado"
  const d = data as Record<string, unknown>
  if (typeof d.error === 'string') return d.error
  if (typeof d.message === 'string') return d.message
  if (d.details && typeof d.details === 'object' && 'message' in d.details) {
    return String((d.details as Record<string, unknown>).message)
  }
  return "Erro inesperado"
}

export const getErrorMessage = (error: CustomAxiosError) => {
  // Formato 1: error.data.error (formato padrão da API)
  if (error?.data?.error) {
    return error.data.error;
  }

  // Formato 2: error.data.details.message
  if (error?.data?.details?.message) {
    return error.data.details.message;
  }

  // Formato 3: error.data.message
  if (error?.data && "message" in error.data) {
    return (error.data as { message: string }).message;
  }

  // Fallback
  return error?.message || "Erro inesperado";
};

export const setFormFieldErrors = <T extends FieldValues>(
  error: CustomAxiosError,
  setError: UseFormSetError<T>,
  fields: Path<T>[]
) => {
  fields.forEach((field) => {
    const fieldError = getFieldError(error, field as string)
    if (fieldError) setError(field, { message: fieldError })
  })
}

export const getFieldError = (error: CustomAxiosError, fieldName: string) => {
  const details = error?.data?.details
  if (details && Array.isArray(details)) {
    const fieldError = details.find(
      (detail: ErrorDetails) => detail.name === fieldName
    );
    return fieldError?.message || null;
  }
  return null;
};
